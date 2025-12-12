import { cookies } from "next/headers";
import { type NextRequest, NextResponse } from "next/server";
import { verifyToken } from "./auth";
import prisma from "./prisma";
import { UserRole } from "@/types/enums";

const COOKIE_NAME = "auth-token";

export async function getAuthToken(): Promise<string | undefined> {
  return (await cookies()).get(COOKIE_NAME)?.value;
}

export async function clearAuthCookies(): Promise<void> {
  (await cookies()).delete(COOKIE_NAME);
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

export function setAuthCookie(
  response: NextResponse,
  token: string,
  maxAge: number
): NextResponse {
  const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    maxAge,
    path: "/",
  };

  response.cookies.set({
    name: COOKIE_NAME,
    value: token,
    ...COOKIE_OPTIONS,
  });
  return response;
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
