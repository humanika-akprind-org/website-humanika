import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { UpdateWorkProgramInput } from "@/types/work";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma } from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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

    const workProgram = await prisma.workProgram.findUnique({
      where: { id: params.id },
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

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

    // Fetch existing work program for logging
    const existingWorkProgram = await prisma.workProgram.findUnique({
      where: { id: params.id },
    });

    if (!existingWorkProgram) {
      return NextResponse.json(
        { error: "Work program not found" },
        { status: 404 }
      );
    }

    const updateData = { ...body } as Prisma.WorkProgramUpdateInput;

    // Handle status change to PENDING - create approval record
    if (body.status === "PENDING") {
      // Create approval record for the work program
      await prisma.approval.create({
        data: {
          entityType: "WORK_PROGRAM",
          entityId: params.id,
          userId: user.id, // Current user submitting for approval
          status: "PENDING",
          note: "Work program submitted for approval",
        },
      });
    }

    // Calculate remaining funds if funds or usedFunds is updated
    if (body.funds !== undefined || body.usedFunds !== undefined) {
      const currentProgram = await prisma.workProgram.findUnique({
        where: { id: params.id },
      });

      if (currentProgram) {
        const funds =
          body.funds !== undefined ? body.funds : currentProgram.funds;
        const usedFunds =
          body.usedFunds !== undefined
            ? body.usedFunds
            : currentProgram.usedFunds;
        updateData.remainingFunds = funds - usedFunds;
      }
    }

    const workProgram = await prisma.workProgram.update({
      where: { id: params.id },
      data: updateData as Prisma.WorkProgramUpdateInput,
      include: {
        period: true,
        responsible: {
          select: {
            id: true,
            name: true,
            email: true,
            department: true,
          },
        },
        approvals: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
      },
    });

    // Log activity
    await logActivityFromRequest(request, {
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "WorkProgram",
      entityId: workProgram.id,
      description: `Updated work program: ${workProgram.name}`,
      metadata: {
        oldData: {
          name: existingWorkProgram.name,
          department: existingWorkProgram.department,
          schedule: existingWorkProgram.schedule,
          status: existingWorkProgram.status,
          funds: existingWorkProgram.funds,
          usedFunds: existingWorkProgram.usedFunds,
          remainingFunds: existingWorkProgram.remainingFunds,
          goal: existingWorkProgram.goal,
          periodId: existingWorkProgram.periodId,
          responsibleId: existingWorkProgram.responsibleId,
        },
        newData: {
          name: workProgram.name,
          department: workProgram.department,
          schedule: workProgram.schedule,
          status: workProgram.status,
          funds: workProgram.funds,
          usedFunds: workProgram.usedFunds,
          remainingFunds: workProgram.remainingFunds,
          goal: workProgram.goal,
          periodId: workProgram.periodId,
          responsibleId: workProgram.responsibleId,
        },
      },
    });

    return NextResponse.json(workProgram);
  } catch (error) {
    console.error("Error updating work program:", error);
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

    // Validate ID parameter
    if (!params.id || params.id === "undefined" || params.id.trim() === "") {
      return NextResponse.json(
        { error: "Invalid work program ID" },
        { status: 400 }
      );
    }

    // Fetch existing work program for logging
    const existingWorkProgram = await prisma.workProgram.findUnique({
      where: { id: params.id },
    });

    if (!existingWorkProgram) {
      return NextResponse.json(
        { error: "Work program not found" },
        { status: 404 }
      );
    }

    await prisma.workProgram.delete({
      where: { id: params.id },
    });

    // Log activity
    await logActivityFromRequest(_request, {
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "WorkProgram",
      entityId: params.id,
      description: `Deleted work program: ${existingWorkProgram.name}`,
      metadata: {
        oldData: {
          name: existingWorkProgram.name,
          department: existingWorkProgram.department,
          schedule: existingWorkProgram.schedule,
          status: existingWorkProgram.status,
          funds: existingWorkProgram.funds,
          usedFunds: existingWorkProgram.usedFunds,
          remainingFunds: existingWorkProgram.remainingFunds,
          goal: existingWorkProgram.goal,
          periodId: existingWorkProgram.periodId,
          responsibleId: existingWorkProgram.responsibleId,
        },
        newData: null,
      },
    });

    return NextResponse.json({ message: "Work program deleted successfully" });
  } catch (error) {
    console.error("Error deleting work program:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
