/**
 * Create Work Program Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateWorkProgramInput } from "@/domain/entities/work-program.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

/**
 * Create a new work program
 */
export async function createWorkProgram(
  data: CreateWorkProgramInput,
  user: UserWithId,
) {
  if (!data.name || !data.department || !data.periodId || !data.responsibleId) {
    throw new Error("Missing required fields");
  }

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

  return workProgram;
}
