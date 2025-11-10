import { hashPassword } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { UserRole } from "@prisma/client";
import { randomColor } from "@/lib/random-color";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

interface RegisterResult {
  success: boolean;
  user?: Omit<User, "avatarColor">;
  message?: string;
  error?: string;
  status: number;
}

export async function register(
  name: string,
  email: string,
  username: string,
  password: string
): Promise<RegisterResult> {
  try {
    // Input validation
    if (
      !name?.trim() ||
      !email?.trim() ||
      !username?.trim() ||
      !password?.trim()
    ) {
      return {
        success: false,
        error: "Name, email, username, and password are required",
        status: 400,
      };
    }

    if (password.length < 6) {
      return {
        success: false,
        error: "Password must be at least 6 characters",
        status: 400,
      };
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
      return {
        success: false,
        error: "Email or username already exists",
        status: 409,
      };
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

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "User",
      entityId: user.id,
      description: `User registered: ${user.name} (${user.email})`,
      metadata: {
        newData: {
          name: user.name,
          email: user.email,
          username: user.username,
          role: user.role,
        },
      },
    });

    // Create response without password
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      message:
        "Registration successful. Please wait for admin verification before logging in.",
      user: userWithoutPassword as Omit<User, "avatarColor">,
      status: 200,
    };
  } catch (error) {
    console.error("Registration error:", error);
    return {
      success: false,
      error: "Internal server error",
      status: 500,
    };
  }
}
