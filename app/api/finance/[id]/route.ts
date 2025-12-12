import { type NextRequest, NextResponse } from "next/server";
import type { UpdateFinanceInput } from "@/types/finance";
import { getCurrentUser } from "@/lib/auth-server";
import {
  getFinance,
  updateFinance,
  deleteFinance,
} from "@/services/finance/finance.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const finance = await getFinance((await params).id);

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
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateFinanceInput = await request.json();

    const finance = await updateFinance((await params).id, body, user);

    return NextResponse.json(finance);
  } catch (error) {
    console.error("Error updating finance:", error);
    if (error instanceof Error && error.message === "Finance not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
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

    await deleteFinance((await params).id, user);

    return NextResponse.json({ message: "Finance deleted successfully" });
  } catch (error) {
    console.error("Error deleting finance:", error);
    if (error instanceof Error && error.message === "Finance not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
