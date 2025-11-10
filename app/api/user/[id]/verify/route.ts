import { type NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/lib/services/user/user.service";

// PATCH - Verify user account
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const updatedUser = await verifyUser(id);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error verifying user:", error);
    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
