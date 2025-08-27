import { NextResponse } from "next/server";
import { clearAuthCookies } from "@/lib/clearAuthCookies";

export async function POST() {
  try {
    const response = NextResponse.json({
      success: true,
      message: "Logged out successfully",
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
