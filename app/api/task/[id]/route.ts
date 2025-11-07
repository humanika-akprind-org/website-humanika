import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateDepartmentTaskInput } from "@/types/task";
import type { Prisma } from "@prisma/client";
import { getCurrentUser } from "@/lib/auth";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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

    const departmentTask = await prisma.departmentTask.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    if (!departmentTask) {
      return NextResponse.json(
        { error: "Department task not found" },
        { status: 404 }
      );
    }

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

    const departmentTaskData: Prisma.DepartmentTaskUncheckedUpdateInput = {};
    if (body.note !== undefined) departmentTaskData.note = body.note;
    if (body.department !== undefined) departmentTaskData.department = body.department;
    if (body.userId !== undefined) departmentTaskData.userId = body.userId;
    if (body.status !== undefined) departmentTaskData.status = body.status;

    // Get existing task for logging
    const existingTask = await prisma.departmentTask.findUnique({
      where: { id },
    });

    const departmentTask = await prisma.departmentTask.update({
      where: { id },
      data: departmentTaskData,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "DepartmentTask",
      entityId: departmentTask.id,
      description: `Updated department task: ${departmentTask.note}`,
      metadata: {
        oldData: {
          note: existingTask?.note,
          department: existingTask?.department,
          userId: existingTask?.userId,
          status: existingTask?.status,
        },
        newData: {
          note: departmentTask.note,
          department: departmentTask.department,
          userId: departmentTask.userId,
          status: departmentTask.status,
        },
      },
    });

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

    // Check if task exists
    const departmentTask = await prisma.departmentTask.findUnique({
      where: { id },
    });

    if (!departmentTask) {
      return NextResponse.json(
        { error: "Department task not found" },
        { status: 404 }
      );
    }

    await prisma.departmentTask.delete({
      where: { id },
    });

    // Log activity
    await logActivityFromRequest(_request, {
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "DepartmentTask",
      entityId: id,
      description: `Deleted department task: ${departmentTask.note}`,
      metadata: {
        oldData: {
          note: departmentTask.note,
          department: departmentTask.department,
          userId: departmentTask.userId,
          status: departmentTask.status,
        },
        newData: null,
      },
    });

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
