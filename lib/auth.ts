import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

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

// Type for the decoded token
interface DecodedToken {
  userId: string;
}

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, 10);
}

export async function comparePasswords(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}

export function generateToken(userId: string): string {
  return jwt.sign({ userId }, JWT_SECRET, { expiresIn: "7d" });
}

export function verifyToken(token: string): DecodedToken | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return { userId: decoded.userId };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("Token verification failed:", error.message);
    }
    return null;
  }
}

export function setAuthCookie(token: string): void {
  cookies().set(COOKIE_NAME, token, COOKIE_OPTIONS);
}

export function getAuthCookie(): string | undefined {
  return cookies().get(COOKIE_NAME)?.value;
}

export function clearAllAuthCookies(): void {
  // Hapus semua cookie autentikasi
  const cookieNames = [
    COOKIE_NAME,
    "google_access_token",
    "next-auth.session-token",
    "auth-token",
  ];

  cookieNames.forEach((name) => {
    cookies().delete(name);
  });
}

export async function invalidateToken(token: string): Promise<void> {
  try {
    const decoded = verifyToken(token);
    if (!decoded) return;

    // Jika Anda menyimpan token di database, tambahkan logika untuk menghapus/memvalidasi token di sini
    // Contoh:
    // await prisma.tokenBlacklist.create({
    //   data: {
    //     token,
    //     expiresAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7) // 1 week
    //   }
    // });
  } catch (error) {
    console.error("Failed to invalidate token:", error);
  }
}

export async function logoutUser(): Promise<void> {
  const token = getAuthCookie();
  if (token) {
    await invalidateToken(token);
  }
  clearAllAuthCookies();
}

export async function getCurrentUser() {
  const token = getAuthCookie();
  if (!token) return null;

  const decoded = verifyToken(token);
  if (!decoded) return null;

  return await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: {
      id: true,
      username: true,
      email: true,
      name: true,
      role: true,
    },
  });
}

export async function requireAuth(
  request: NextRequest,
  roles: string[] = ["user"]
): Promise<NextResponse | null> {
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.userId },
    select: { role: true },
  });

  if (!user || !roles.includes(user.role)) {
    return NextResponse.redirect(new URL("/unauthorized", request.url));
  }

  return null;
}
