import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/clear-auth-cookies";
import { logout } from "@/services/auth/logout.service";

export async function POST() {
  try {
    const result = await logout();

    if (!result.success) {
      return NextResponse.json(
        { success: result.success, error: result.error },
        { status: result.status }
      );
    }

    const response = NextResponse.json({
      success: result.success,
      message: result.message,
    });

    return clearAuthCookies(response);
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
