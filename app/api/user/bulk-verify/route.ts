import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// POST - Bulk verify users
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { userIds } = body;

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      return NextResponse.json(
        { error: "userIds array is required" },
        { status: 400 }
      );
    }

    // Verify all users
    const result = await prisma.user.updateMany({
      where: {
        id: { in: userIds },
      },
      data: { verifiedAccount: true },
    });

    return NextResponse.json({
      count: result.count,
      message: `${result.count} users verified successfully`
    });
  } catch (error) {
    console.error("Error bulk verifying users:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
