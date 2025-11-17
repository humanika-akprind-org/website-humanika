import { type NextRequest, NextResponse } from "next/server";
import type { UpdateDepartmentTaskInput } from "@/types/task";
import { getCurrentUser } from "@/lib/auth";
import {
  getDepartmentTask,
  updateDepartmentTask,
  deleteDepartmentTask,
} from "@/services/task/task.service";

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const departmentTask = await getDepartmentTask(id);

    return NextResponse.json(departmentTask);
  } catch (error) {
    console.error("Error fetching department task:", error);
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

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    const body: UpdateDepartmentTaskInput = await request.json();

    if (
      !body.note &&
      !body.department &&
      body.userId === undefined &&
      !body.status
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    const departmentTask = await updateDepartmentTask(id, body, user);

    return NextResponse.json(departmentTask);
  } catch (error) {
    console.error("Error updating department task:", error);
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

    const { id } = params;

    if (!id) {
      return NextResponse.json({ error: "ID is required" }, { status: 400 });
    }

    await deleteDepartmentTask(id, user);

    return NextResponse.json({
      message: "Department task deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting department task:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
