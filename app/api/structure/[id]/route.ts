import { type NextRequest, NextResponse } from "next/server";
import type { UpdateOrganizationalStructureInput } from "@/types/structure";
import { getCurrentUser } from "@/lib/auth";
import {
  getStructure,
  updateStructure,
  deleteStructure,
} from "@/services/structure/structure.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const structure = await getStructure(params.id);

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error fetching organizational structure:", error);
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
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

    const body: UpdateOrganizationalStructureInput = await request.json();

    const structure = await updateStructure(params.id, body, user);

    return NextResponse.json(structure);
  } catch (error) {
    console.error("Error updating organizational structure:", error);
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
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
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteStructure(params.id, user);

    return NextResponse.json({
      message: "Organizational structure deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting organizational structure:", error);
    if (
      error instanceof Error &&
      error.message === "Organizational structure not found"
    ) {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
