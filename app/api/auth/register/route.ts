import { NextResponse } from "next/server";
import { register } from "@/lib/services/auth/register.service";

export async function POST(request: Request) {
  try {
    const { name, email, username, password } = await request.json();

    const result = await register(name, email, username, password);

    if (!result.success) {
      return NextResponse.json(
        { success: result.success, error: result.error },
        { status: result.status }
      );
    }

    const response = NextResponse.json({
      success: result.success,
      message: result.message,
      user: result.user,
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
