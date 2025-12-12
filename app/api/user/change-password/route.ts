import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth-server";
import { changePassword } from "@/services/user/user.service";

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { currentPassword, newPassword } = body;

    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    await changePassword(currentUser.id, currentPassword, newPassword);

    return NextResponse.json({ message: "Password changed successfully" });
  } catch (error) {
    console.error("Error changing password:", error);
    if (
      error instanceof Error &&
      error.message === "User not found or password not set"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    if (
      error instanceof Error &&
      error.message === "Current password is incorrect"
    ) {
      return NextResponse.json({ error: error.message }, { status: 403 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
