import { comparePasswords, generateToken } from "@/lib/auth";
import prisma from "@/lib/prisma";
import type { User } from "@/types/user";

interface LoginResult {
  success: boolean;
  user?: Omit<User, "avatarColor">;
  token?: string;
  error?: string;
  status: number;
}

export async function login(
  usernameOrEmail: string,
  password: string
): Promise<LoginResult> {
  try {
    if (!usernameOrEmail?.trim() || !password?.trim()) {
      return {
        success: false,
        error: "Username/email and password are required",
        status: 400,
      };
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
      return {
        success: false,
        error: "User not found",
        status: 404,
      };
    }

    if (!["ANGGOTA"].includes(user.role)) {
      return {
        success: false,
        error: "Access denied. ANGGOTA only.",
        status: 403,
      };
    }

    // Check if account is verified
    if (!user.verifiedAccount) {
      return {
        success: false,
        error: "Account not verified. Please wait for admin verification.",
        status: 401,
      };
    }

    // Check if account is active
    if (!user.isActive) {
      return {
        success: false,
        error: "Account is inactive. Please contact administrator.",
        status: 401,
      };
    }

    // Check if account is blocked
    if (user.blockExpires && user.blockExpires > new Date()) {
      return {
        success: false,
        error: "Account is temporarily blocked",
        status: 401,
      };
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

      return {
        success: false,
        error: "Invalid credentials",
        status: 401,
      };
    }

    await prisma.user.update({
      where: { id: user.id },
      data: { attemptLogin: 0, blockExpires: null },
    });

    const token = generateToken(user.id);
    const { password: _, ...userWithoutPassword } = user;

    return {
      success: true,
      user: userWithoutPassword as Omit<User, "avatarColor">,
      token,
      status: 200,
    };
  } catch (error) {
    console.error("Login error:", error);
    return {
      success: false,
      error: "Internal server error",
      status: 500,
    };
  }
}
