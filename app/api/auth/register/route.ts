import { NextResponse } from "next/server";
import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { randomColor } from "@/lib/randomColor";

export async function POST(request: Request) {
  try {
    const { name, email, username, password } =
      await request.json();

    // Input validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password?.trim()
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Name, email, username, and password are required",
        },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { success: false, error: "Password must be at least 6 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: email.trim().toLowerCase() },
          { username: username.trim().toLowerCase() },
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        { success: false, error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create user with default role ANGGOTA
    const user = await prisma.user.create({
      data: {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        username: username.trim().toLowerCase(),
        password: hashedPassword,
        role: UserRole.ANGGOTA,
        isActive: false,
        verifiedAccount: false,
        attemptLogin: 0,
        avatarColor: randomColor,
      },
    });

    // Create response without password
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      success: true,
      message: "Registration successful. Please wait for admin verification before logging in.",
      user: userWithoutPassword,
    });

    // Do NOT set auth cookie here to prevent auto-login before verification
    return response;
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
