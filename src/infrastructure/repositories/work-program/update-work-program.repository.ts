/**
 * Update Work Program Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateWorkProgramInput } from "@/domain/entities/work-program.entity";
import type { User } from "@/domain/entities/user.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing work program
 */
export async function updateWorkProgram(
  id: string,
  data: UpdateWorkProgramInput,
  user: UserWithId,
) {
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

  return workProgram;
}
