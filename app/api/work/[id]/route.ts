import { type NextRequest, NextResponse } from "next/server";
import type { UpdateWorkProgramInput } from "@/types/work";
import { getCurrentUser } from "@/lib/auth";
import {
  getWorkProgram,
  updateWorkProgram,
  deleteWorkProgram,
} from "@/services/work/work.service";

// GET work program by ID
export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const workProgram = await getWorkProgram(params.id);

    if (!workProgram) {
      return NextResponse.json(
        { error: "Work program not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(workProgram);
  } catch (error) {
    console.error("Error fetching work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// PUT update work program
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: UpdateWorkProgramInput = await request.json();

    const workProgram = await updateWorkProgram(params.id, body, user);

    return NextResponse.json(workProgram);
  } catch (error) {
    console.error("Error updating work program:", error);
    if (error instanceof Error && error.message === "Work program not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE work program
export async function DELETE(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await deleteWorkProgram(params.id, user);

    return NextResponse.json({ message: "Work program deleted successfully" });
  } catch (error) {
    console.error("Error deleting work program:", error);
    if (error instanceof Error && error.message === "Invalid work program ID") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message === "Work program not found") {
      return NextResponse.json({ error: error.message }, { status: 404 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
