import { NextResponse } from "next/server";
import { comparePasswords, generateToken, setAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    if (!usernameOrEmail?.trim() || !password?.trim()) {
      return NextResponse.json(
        { success: false, error: "Username/email and password are required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findFirst({
      where: {
        OR: [
          { username: usernameOrEmail.trim() },
          { email: usernameOrEmail.trim() },
        ],
        role: "ANGGOTA", // Only ANGGOTA role can login
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "Access denied. ANGGOTA only." },
        { status: 401 }
      );
    }

    // Check if account is blocked
    if (user.blockExpires && user.blockExpires > new Date()) {
      return NextResponse.json(
        { success: false, error: "Account is temporarily blocked" },
        { status: 401 }
      );
    }

    const isPasswordValid = await comparePasswords(password, user.password);
    if (!isPasswordValid) {
      const attemptLogin = user.attemptLogin + 1;
      let blockExpires = null;

      if (attemptLogin >= 5) {
        blockExpires = new Date(Date.now() + 30 * 60 * 1000);
      }

      await prisma.user.update({
        where: { id: user.id },
        data: { attemptLogin, blockExpires },
      });

      return NextResponse.json(
        { success: false, error: "Invalid credentials" },
        { status: 401 }
      );
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { attemptLogin: 0, blockExpires: null },
    });

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
