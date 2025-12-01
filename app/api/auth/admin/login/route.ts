import { NextResponse } from "next/server";
import { setAuthCookie } from "@/lib/auth";
import { adminLogin } from "@/services/auth/admin-login.service";

export async function POST(request: Request) {
  try {
    const { usernameOrEmail, password } = await request.json();

    const result = await adminLogin(usernameOrEmail, password);

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

    return setAuthCookie(response, result.token!, 60 * 60); // 1 hour
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
