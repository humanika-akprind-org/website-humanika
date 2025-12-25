import { type NextRequest, NextResponse } from "next/server";
import { getCurrentUser, clearAuthCookies } from "@/lib/auth-server";
import { deleteAccount } from "@/services/user/user.service";

export async function DELETE(_request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || !currentUser.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteAccount(currentUser.id);

    // Log out the user after deletion
    await clearAuthCookies();

    return NextResponse.json({ message: "Account deleted successfully" });
  } catch (error) {
    console.error("Error deleting account:", error);
    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
