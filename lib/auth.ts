import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || "your-very-secure-secret";
const COOKIE_NAME = "auth-token";
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "strict" as const,
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
};

interface DecodedToken {
  userId: string;
  iat?: number;
  exp?: number;
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

// Add this version of setAuthCookie
export function setAuthCookie(
  response: NextResponse,
  token: string
): NextResponse {
  response.cookies.set({
    name: "auth-token",
    value: token,
    ...COOKIE_OPTIONS, // Spread existing options
  });
  return response;
}

export function getAuthToken(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export function clearAuthCookies(): void {
  cookies().delete(COOKIE_NAME);
  // Additional cookies can be cleared here if needed
}

export async function invalidateToken(token: string): Promise<void> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return;

    // Implement token invalidation logic here if using a blacklist
    // await prisma.invalidatedToken.create({
    //   data: { token, expiresAt: new Date(decoded.exp * 1000) }
    // });
  } catch (error) {
    console.error(
      "Token invalidation failed:",
      error instanceof Error ? error.message : error
    );
  }
}

export async function logoutUser(): Promise<void> {
  const token = getAuthToken();
  if (token) {
    await invalidateToken(token);
  }
  clearAuthCookies();
}

export async function getCurrentUser() {
  const token = getAuthToken();
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
  allowedRoles: string[] = ["user"]
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
      select: { role: true }, // Removed isActive from selection
    });

    if (!user || !allowedRoles.includes(user.role)) {
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