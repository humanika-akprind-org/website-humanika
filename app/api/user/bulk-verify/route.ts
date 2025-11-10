import { type NextRequest, NextResponse } from "next/server";
import { bulkVerifyUsers } from "@/lib/services/user/user.service";

// POST - Bulk verify users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds } = body;

    const result = await bulkVerifyUsers(userIds);

    return NextResponse.json({
      count: result.count,
      message: `${result.count} users verified successfully`,
    });
  } catch (error) {
    console.error("Error bulk verifying users:", error);
    if (
      error instanceof Error &&
      error.message === "userIds array is required"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
