import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// PATCH - Verify user account
export async function PATCH(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Verify user account
    const updatedUser = await prisma.user.update({
      where: { id },
      data: {
        verifiedAccount: true,
      },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        department: true,
        position: true,
        isActive: true,
        verifiedAccount: true,
        updatedAt: true,
      },
    });

    return NextResponse.json(updatedUser);
  } catch (error) {
    console.error("Error verifying user:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
