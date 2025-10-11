import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateFinanceCategoryInput } from "@/types/finance-category";
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

    const financeCategory = await prisma.financeCategory.findUnique({
      where: { id: params.id },
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
    });

    if (!financeCategory) {
      return NextResponse.json({ error: "Finance category not found" }, { status: 404 });
    }

    return NextResponse.json(financeCategory);
  } catch (error) {
    console.error("Error fetching finance category:", error);
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

    const body: UpdateFinanceCategoryInput = await request.json();

    // Check if finance category exists
    const existingFinanceCategory = await prisma.financeCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingFinanceCategory) {
      return NextResponse.json({ error: "Finance category not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = {};

    if (body.name !== undefined) updateData.name = body.name;
    if (body.description !== undefined) updateData.description = body.description;
    if (body.type) updateData.type = body.type;
    if (body.isActive !== undefined) updateData.isActive = body.isActive;

    const financeCategory = await prisma.financeCategory.update({
      where: { id: params.id },
      data: updateData,
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
    });

    return NextResponse.json(financeCategory);
  } catch (error) {
    console.error("Error updating finance category:", error);
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return NextResponse.json(
        { error: "Category name must be unique" },
        { status: 400 }
      );
    }
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

    // Check if finance category exists
    const existingFinanceCategory = await prisma.financeCategory.findUnique({
      where: { id: params.id },
    });

    if (!existingFinanceCategory) {
      return NextResponse.json({ error: "Finance category not found" }, { status: 404 });
    }

    await prisma.financeCategory.delete({
      where: { id: params.id },
    });

    return NextResponse.json({ message: "Finance category deleted successfully" });
  } catch (error) {
    console.error("Error deleting finance category:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
