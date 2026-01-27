/**
 * Delete Work Program Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

/**
 * Delete a single work program by its ID
 */
export async function deleteWorkProgram(id: string, user: UserWithId) {
  if (!id || id === "undefined" || id.trim() === "") {
    throw new Error("Invalid work program ID");
  }

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
