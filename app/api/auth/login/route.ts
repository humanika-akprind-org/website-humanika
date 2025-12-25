import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth-server";
import { login } from "@/services/auth/login.service";

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    const result = await login(usernameOrEmail, password);

    if (!result.success) {
      return NextResponse.json(
        { success: result.success, error: result.error },
        { status: result.status }
      );
    }

    const response = NextResponse.json({
      success: result.success,
      user: result.user,
    });

    return setAuthCookie(response, result.token!, 60 * 60 * 24 * 7); // 1 week
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
