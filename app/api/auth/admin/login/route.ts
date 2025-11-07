import { NextResponse } from "next/server";
import { comparePasswords, generateToken, setAuthCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 }
      );
    }

    if (!["DPO", "BPH", "PENGURUS"].includes(user.role)) {
      return NextResponse.json(
        { success: false, error: "Access denied. ADMIN only." },
        { status: 403 }
      );
    }

    // Note: Admin accounts may not need verification check as they have elevated privileges
    // Uncomment the following lines if you want to enforce verification for admins too
    if (!user.verifiedAccount) {
      return NextResponse.json(
        {
          success: false,
          error: "Account not verified. Please contact administrator.",
        },
        { status: 401 }
      );
    }

    // Check if account is active
    if (!user.isActive) {
      return NextResponse.json(
        {
          success: false,
          error: "Account is inactive. Please contact administrator.",
        },
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

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.LOGIN,
      entityType: "User",
      entityId: user.id,
      description: `Admin login: ${user.name} (${user.email})`,
      metadata: {
        details: {
          role: user.role,
          loginMethod: "admin",
        },
      },
    });

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;
    const response = NextResponse.json({
      success: true,
      user: userWithoutPassword,
    });

    return setAuthCookie(response, token);
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
