/**
 * Work Program Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements the IWorkProgramRepository interface using Prisma ORM.
 * Following the Repository Pattern for data access abstraction.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";
import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { Prisma } from "@prisma/client";

/**
 * Work Program Repository Prisma Implementation
 * Handles all database operations for work programs using Prisma ORM.
 */
export class WorkProgramRepositoryPrisma implements IWorkProgramRepository {
  /**
   * Get all work programs with optional filters
   */
  async getWorkPrograms(filter?: WorkProgramFilter): Promise<WorkProgram[]> {
    const where: Prisma.WorkProgramWhereInput = {};

    if (filter?.department) where.department = { equals: filter.department };
    if (filter?.status) {
      where.status = { equals: filter.status };
    }
    if (filter?.periodId) where.periodId = filter.periodId;
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { goal: { contains: filter.search, mode: "insensitive" } },
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

    return workPrograms as unknown as WorkProgram[];
  }

  /**
   * Get a single work program by its ID
   */
  async getWorkProgramById(id: string): Promise<WorkProgram | null> {
    const workProgram = await prisma.workProgram.findUnique({
      where: { id },
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

    return workProgram as unknown as WorkProgram | null;
  }

  /**
   * Create a new work program
   */
  async createWorkProgram(
    data: CreateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    const workProgram = await prisma.workProgram.create({
      data: {
        name: data.name,
        department: data.department,
        schedule: data.schedule || "",
        status: data.status || "DRAFT",
        funds: data.funds || 0,
        usedFunds: data.usedFunds || 0,
        remainingFunds: (data.funds || 0) - (data.usedFunds || 0),
        goal: data.goal || "",
        periodId: data.periodId,
        responsibleId: data.responsibleId,
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
    await logActivity({
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
    if (data.status === "PENDING") {
      await prisma.approval.create({
        data: {
          entityType: "WORK_PROGRAM",
          entityId: workProgram.id,
          userId: user.id,
          status: "PENDING",
          note: "Work program submitted for approval",
        },
      });
    }

    return workProgram as unknown as WorkProgram;
  }

  /**
   * Update an existing work program
   */
  async updateWorkProgram(
    id: string,
    data: UpdateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    const existingWorkProgram = await prisma.workProgram.findUnique({
      where: { id },
      include: { approvals: true },
    });

    if (!existingWorkProgram) {
      throw new Error("Work program not found");
    }

    const updateData: Prisma.WorkProgramUpdateInput = { ...data };

    // Check if there are changes to the work program (excluding status)
    const hasChanges =
      (data.name !== undefined && data.name !== existingWorkProgram.name) ||
      (data.department !== undefined &&
        data.department !== existingWorkProgram.department) ||
      (data.schedule !== undefined &&
        data.schedule !== existingWorkProgram.schedule) ||
      (data.funds !== undefined && data.funds !== existingWorkProgram.funds) ||
      (data.usedFunds !== undefined &&
        data.usedFunds !== existingWorkProgram.usedFunds) ||
      (data.goal !== undefined && data.goal !== existingWorkProgram.goal) ||
      (data.periodId !== undefined &&
        data.periodId !== existingWorkProgram.periodId) ||
      (data.responsibleId !== undefined &&
        data.responsibleId !== existingWorkProgram.responsibleId);

    // If there are changes and the work program has an existing approval that is APPROVED or REJECTED,
    // reset the approval to PENDING
    if (
      hasChanges &&
      existingWorkProgram.approvals &&
      existingWorkProgram.approvals.length > 0 &&
      (existingWorkProgram.approvals[0].status === "APPROVED" ||
        existingWorkProgram.approvals[0].status === "REJECTED")
    ) {
      await prisma.approval.update({
        where: { id: existingWorkProgram.approvals[0].id },
        data: {
          status: "PENDING",
          note: "Work program updated and resubmitted for approval",
        },
      });
      // Also update the work program status to PENDING
      updateData.status = "PENDING";
    }

    // Handle status change to PENDING - create or update approval record
    if (data.status === "PENDING") {
      // Check if there's already an approval record for this work program
      const existingApproval = await prisma.approval.findFirst({
        where: {
          entityType: "WORK_PROGRAM",
          entityId: id,
        },
      });

      if (existingApproval) {
        // Update existing approval
        await prisma.approval.update({
          where: { id: existingApproval.id },
          data: {
            status: "PENDING",
            note: "Work program submitted for approval",
          },
        });
      } else {
        // Create new approval
        await prisma.approval.create({
          data: {
            entityType: "WORK_PROGRAM",
            entityId: id,
            userId: user.id,
            status: "PENDING",
            note: "Work program submitted for approval",
          },
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
      }
    }

    // Calculate remaining funds if funds or usedFunds is updated
    if (data.funds !== undefined || data.usedFunds !== undefined) {
      const funds =
        data.funds !== undefined ? data.funds : existingWorkProgram.funds;
      const usedFunds =
        data.usedFunds !== undefined
          ? data.usedFunds
          : existingWorkProgram.usedFunds;
      updateData.remainingFunds = funds - usedFunds;
    }

    const workProgram = await prisma.workProgram.update({
      where: { id },
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
    await logActivity({
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

    return workProgram as unknown as WorkProgram;
  }

  /**
   * Delete a single work program by its ID
   */
  async deleteWorkProgram(id: string, user: { id: string }): Promise<void> {
    const existingWorkProgram = await prisma.workProgram.findUnique({
      where: { id },
    });

    if (!existingWorkProgram) {
      throw new Error("Work program not found");
    }

    await prisma.workProgram.delete({
      where: { id },
    });

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "WorkProgram",
      entityId: id,
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
  }

  /**
   * Delete multiple work programs by their IDs
   */
  async bulkDeleteWorkPrograms(
    ids: string[],
    user: { id: string },
  ): Promise<{ count: number }> {
    const validIds = ids.filter(
      (id) => typeof id === "string" && id.trim() !== "" && id !== "undefined",
    );

    const workProgramsToDelete = await prisma.workProgram.findMany({
      where: {
        id: { in: validIds },
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

    const deleteResult = await prisma.workProgram.deleteMany({
      where: {
        id: { in: validIds },
      },
    });

    // Log activity for each deleted work program
    for (const workProgram of workProgramsToDelete) {
      await logActivity({
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

    return deleteResult;
  }
}
