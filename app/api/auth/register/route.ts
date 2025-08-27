import { NextResponse } from "next/server";
import { hashPassword, generateToken, setAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";

export async function POST(request: Request) {
  try {
    const { name, email, username, password, division, position } =
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
        division: division?.trim() || null,
        position: position?.trim() || null,
        isActive: true,
        verifiedEmail: false,
        attemptLogin: 0,
      },
    });

    // Generate token
    const token = generateToken(user.id);

    // Create response without password
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    // Set cookie
    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
