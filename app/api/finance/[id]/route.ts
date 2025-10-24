import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateFinanceInput } from "@/types/finance";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const finance = await prisma.finance.findUnique({
      where: { id: params.id },
      include: {
        period: true,
        category: true,
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!finance) {
      return NextResponse.json({ error: "Finance not found" }, { status: 404 });
    }

    return NextResponse.json(finance);
  } catch (error) {
    console.error("Error fetching finance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateFinanceInput = await request.json();

    // Check if finance exists
    const existingFinance = await prisma.finance.findUnique({
      where: { id: params.id },
    });

    if (!existingFinance) {
      return NextResponse.json({ error: "Finance not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.amount !== undefined) updateData.amount = body.amount;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.date !== undefined) updateData.date = new Date(body.date);
    if (body.categoryId !== undefined) updateData.categoryId = body.categoryId;
    if (body.type !== undefined) updateData.type = body.type;
    if (body.periodId !== undefined) updateData.periodId = body.periodId;
    if (body.eventId !== undefined && body.eventId.trim() !== "") {
      updateData.eventId = body.eventId;
    } else if (body.eventId === "") {
      // If empty string is provided, set to null to clear the relation
      updateData.eventId = null;
    }
    if (body.proof !== undefined) updateData.proof = body.proof;
    if (body.status !== undefined) updateData.status = body.status;

    const finance = await prisma.finance.update({
      where: { id: params.id },
      data: updateData,
      include: {
        period: true,
        category: true,
        event: {
          select: {
            id: true,
            name: true,
          },
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(finance);
  } catch (error) {
    console.error("Error updating finance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Check if finance exists
    const existingFinance = await prisma.finance.findUnique({
      where: { id: params.id },
    });

    if (!existingFinance) {
      return NextResponse.json({ error: "Finance not found" }, { status: 404 });
    }

    await prisma.finance.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Finance deleted successfully" });
  } catch (error) {
    console.error("Error deleting finance:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
