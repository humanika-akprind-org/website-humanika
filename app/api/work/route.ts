import { type NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { CreateWorkProgramInput } from "@/types/work";
import type { Status, Department } from "@/types/enums";
import { getCurrentUser } from "@/lib/auth";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

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

    const where: Prisma.WorkProgramWhereInput = {};

    if (department) where.department = { equals: department };
    if (status) where.status = { equals: status as unknown as PrismaStatus };
    if (periodId) where.periodId = periodId;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: "insensitive" } },
        { goal: { contains: search, mode: "insensitive" } },
      ];
    }

    const workPrograms = await prisma.workProgram.findMany({
      where,
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
      orderBy: { createdAt: "desc" },
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

    if (
      !body.name ||
      !body.department ||
      !body.periodId ||
      !body.responsibleId
    ) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const workProgram = await prisma.workProgram.create({
      data: {
        name: body.name,
        department: body.department,
        schedule: body.schedule || "",
        status: body.status || "DRAFT",
        funds: body.funds || 0,
        usedFunds: body.usedFunds || 0,
        remainingFunds: (body.funds || 0) - (body.usedFunds || 0),
        goal: body.goal || "",
        periodId: body.periodId,
        responsibleId: body.responsibleId,
      },
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
      activityType: ActivityType.CREATE,
      entityType: "WorkProgram",
      entityId: workProgram.id,
      description: `Created work program: ${workProgram.name}`,
      metadata: {
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

    // Handle status change to PENDING - create approval record
    if (body.status === "PENDING") {
      // Create approval record for the work program
      await prisma.approval.create({
        data: {
          entityType: "WORK_PROGRAM",
          entityId: workProgram.id,
          userId: user.id, // Current user submitting for approval
          status: "PENDING",
          note: "Work program submitted for approval",
        },
      });
    }

    return NextResponse.json(workProgram, { status: 201 });
  } catch (error) {
    console.error("Error creating work program:", error);
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

    if (!Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: "Invalid or missing IDs array" },
        { status: 400 }
      );
    }

    // Validate all IDs are strings and not empty
    const validIds = ids.filter(
      (id) => typeof id === "string" && id.trim() !== "" && id !== "undefined"
    );
    if (validIds.length === 0) {
      return NextResponse.json(
        { error: "No valid IDs provided" },
        { status: 400 }
      );
    }

    // Get work programs before deletion for logging
    const workProgramsToDelete = await prisma.workProgram.findMany({
      where: {
        id: {
          in: validIds,
        },
      },
      select: {
        id: true,
        name: true,
        department: true,
        schedule: true,
        status: true,
        funds: true,
        usedFunds: true,
        remainingFunds: true,
        goal: true,
        periodId: true,
        responsibleId: true,
      },
    });

    // Delete work programs
    const deleteResult = await prisma.workProgram.deleteMany({
      where: {
        id: {
          in: validIds,
        },
      },
    });

    // Log activity for each deleted work program
    for (const workProgram of workProgramsToDelete) {
      await logActivityFromRequest(request, {
        userId: user.id,
        activityType: ActivityType.DELETE,
        entityType: "WorkProgram",
        entityId: workProgram.id,
        description: `Deleted work program: ${workProgram.name}`,
        metadata: {
          oldData: {
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
          newData: null,
        },
      });
    }

    return NextResponse.json({
      message: `Successfully deleted ${deleteResult.count} work programs`,
      deletedCount: deleteResult.count,
    });
  } catch (error) {
    console.error("Error deleting work programs:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
