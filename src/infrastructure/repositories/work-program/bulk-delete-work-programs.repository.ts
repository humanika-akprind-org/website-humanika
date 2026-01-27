/**
 * Bulk Delete Work Programs Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

/**
 * Delete multiple work programs by their IDs
 */
export async function bulkDeleteWorkPrograms(ids: string[], user: UserWithId) {
  if (!Array.isArray(ids) || ids.length === 0) {
    throw new Error("Invalid or missing IDs array");
  }

  const validIds = ids.filter(
    (id) => typeof id === "string" && id.trim() !== "" && id !== "undefined",
  );
  if (validIds.length === 0) {
    throw new Error("No valid IDs provided");
  }

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
