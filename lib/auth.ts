import type { Position, Department } from "@/types/enums";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import type { User } from "@/types/user";
import { UserRole } from "@/types/enums";
import { nodeEnv, isProduction, jwtSecret } from "@/lib/config/config";

// Use the singleton pattern for Prisma to avoid multiple instances
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (nodeEnv !== "production") globalForPrisma.prisma = prisma;

const JWT_SECRET = jwtSecret;
const COOKIE_NAME = "auth-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: isProduction,
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
};

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
}

interface LoginResponse {
  success: boolean;
  user?: Omit<User, "avatarColor">;
  token?: string;
  error?: string;
}

interface CreateUserResponse {
  success: boolean;
  user?: Omit<User, "avatarColor">;
  error?: string;
}

interface UserWithPassword extends Omit<User, "avatarColor"> {
  password: string;
}

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(
  plainTextPassword: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(plainTextPassword, hashedPassword);
}

export function generateToken(userId: string): string {
  if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    if (!JWT_SECRET) throw new Error("JWT_SECRET is not defined");
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload & DecodedToken;
    return { userId: decoded.userId };
  } catch (error) {
    console.error(
      "Token verification failed:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export function setAuthCookie(
  response: NextResponse,
  token: string,
  maxAge: number
): NextResponse {
  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    ...COOKIE_OPTIONS,
    maxAge,
  });
  return response;
}

export async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function clearAuthCookies(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
}

export async function invalidateToken(token: string): Promise<void> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return;

    // Implement token invalidation logic here if using a blacklist
    // Example with Prisma (uncomment if you have an InvalidatedToken model):
    /*
    await prisma.invalidatedToken.create({
      data: { 
        token, 
        expiresAt: new Date((decoded.exp || 0) * 1000) 
      }
    });
    */
  } catch (error) {
    console.error(
      "Token invalidation failed:",
      error instanceof Error ? error.message : error
    );
  }
}

export async function getCurrentUser() {
  const token = await getAuthToken();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  try {
    return await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        attemptLogin: true,
        blockExpires: true,
        avatarColor: true,
        createdAt: true,
        updatedAt: true,
      },
    });
  } catch (error) {
    console.error(
      "Failed to fetch user:",
      error instanceof Error ? error.message : error
    );
    return null;
  }
}

export async function requireAuth(
  request: NextRequest,
  allowedRoles: UserRole[] = [UserRole.ANGGOTA]
): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;

  if (!token) {
    return NextResponse.redirect(
      new URL("/auth/login?error=unauthorized", request.url)
    );
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    clearAuthCookies();
    return NextResponse.redirect(
      new URL("/auth/login?error=invalid_token", request.url)
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: { role: true },
    });

    if (!user || !allowedRoles.includes(user.role as UserRole)) {
      return NextResponse.redirect(new URL("/unauthorized", request.url));
    }

    return null;
  } catch (error) {
    console.error(
      "Auth check failed:",
      error instanceof Error ? error.message : error
    );
    return NextResponse.redirect(
      new URL("/auth/login?error=server_error", request.url)
    );
  }
}

// Additional utility functions that might be useful

export async function loginUser(
  email: string,
  password: string
): Promise<LoginResponse> {
  try {
    const user = (await prisma.user.findUnique({
      where: { email },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        attemptLogin: true,
        blockExpires: true,
        createdAt: true,
        updatedAt: true,
        password: true,
      },
    })) as UserWithPassword | null;

    if (!user) {
      return { success: false, error: "User not found" };
    }

    const isPasswordValid = await comparePasswords(password, user.password);

    if (!isPasswordValid) {
      return { success: false, error: "Invalid password" };
    }

    const token = generateToken(user.id);

    // Return user data without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword,
      token,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Login failed",
    };
  }
}

export async function createUser(userData: {
  username: string;
  email: string;
  password: string;
  name: string;
  role?: string;
  department?: string;
  position?: string;
}): Promise<CreateUserResponse> {
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email: userData.email }, { username: userData.username }],
      },
    });

    if (existingUser) {
      return {
        success: false,
        error: "User with this email or username already exists",
      };
    }

    // Hash password
    const hashedPassword = await hashPassword(userData.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        username: userData.username,
        email: userData.email,
        password: hashedPassword,
        name: userData.name,
        role: (userData.role as UserRole) || UserRole.ANGGOTA,
        department: userData.department as Department,
        position: userData.position as Position,
      },
      select: {
        id: true,
        username: true,
        email: true,
        name: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        attemptLogin: true,
        blockExpires: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return {
      success: true,
      user: user as unknown as Omit<User, "avatarColor">,
    };
  } catch (error) {
    console.error("Create user error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "User creation failed",
    };
  }
}
