import { type NextRequest, NextResponse } from "next/server";
import type { CreateWorkProgramInput } from "@/types/work";
import type { Status, Department } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import {
  getWorkPrograms,
  createWorkProgram,
  bulkDeleteWorkPrograms,
} from "@/services/work/work.service";

export async function GET(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const department = searchParams.get("department") as Department;
    const status = searchParams.get("status") as unknown as Status;
    const periodId = searchParams.get("periodId");
    const search = searchParams.get("search");

    const workPrograms = await getWorkPrograms({
      department: department || undefined,
      status,
      periodId: periodId || undefined,
      search: search || undefined,
    });

    return NextResponse.json(workPrograms);
  } catch (error) {
    console.error("Error fetching work programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body: CreateWorkProgramInput = await request.json();

    const workProgram = await createWorkProgram(body, user);

    return NextResponse.json(workProgram, { status: 201 });
  } catch (error) {
    console.error("Error creating work program:", error);
    if (error instanceof Error && error.message === "Missing required fields") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { ids } = body;

    const deleteResult = await bulkDeleteWorkPrograms(ids, user);

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} work programs`,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting work programs:", error);
    if (
      error instanceof Error &&
      error.message === "Invalid or missing IDs array"
    ) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    if (error instanceof Error && error.message === "No valid IDs provided") {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
