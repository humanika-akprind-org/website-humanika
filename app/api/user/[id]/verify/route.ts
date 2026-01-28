import { type NextRequest, NextResponse } from "next/server";
import { verifyUser } from "@/infrastructure/repositories/user";

// PATCH - Verify user account
// Note: This operation is simple enough that it doesn't require a full use case pattern.
// The repository method already handles validation and activity logging internally.
// For more complex operations, consider using a dedicated use case class.

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    const updatedUser = await verifyUser(id);

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error verifying user:", error);
    if (error instanceof Error && error.message === "User not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
