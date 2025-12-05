import { type NextRequest, NextResponse } from "next/server";
import type { UpdateFinanceCategoryInput } from "@/types/finance-category";
import { getCurrentUser } from "@/lib/auth";
import {
  getFinanceCategory,
  updateFinanceCategory,
  deleteFinanceCategory,
} from "@/services/finance/finance-category.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const financeCategory = await getFinanceCategory((await params).id);

    if (!financeCategory) {
      return NextResponse.json(
        { error: "Finance category not found" },
        { status: 404 }
      );
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateFinanceCategoryInput = await request.json();

    const financeCategory = await updateFinanceCategory(
      (
        await params
      ).id,
      body,
      user
    );

    return NextResponse.json(financeCategory);
  } catch (error) {
    console.error("Error updating finance category:", error);
    if (
      error instanceof Error &&
      error.message === "Finance category not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteFinanceCategory((await params).id, user);

    return NextResponse.json({
      message: "Finance category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting finance category:", error);
    if (
      error instanceof Error &&
      error.message === "Finance category not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
