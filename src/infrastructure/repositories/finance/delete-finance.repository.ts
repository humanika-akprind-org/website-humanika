/**
 * Delete Finance Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a finance transaction
 */
export async function deleteFinance(id: string, user: UserWithId) {
  // Check if finance exists
  const existingFinance = await prisma.finance.findUnique({
    where: { id },
  });

  if (!existingFinance) {
    throw new Error("Finance not found");
  }

  await prisma.finance.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Finance",
    entityId: id,
    description: `Deleted finance transaction: ${existingFinance.name}`,
    metadata: {
      oldData: {
        name: existingFinance.name,
        amount: existingFinance.amount,
        description: existingFinance.description,
        date: existingFinance.date,
        categoryId: existingFinance.categoryId,
        type: existingFinance.type,
        workProgramId: existingFinance.workProgramId,
        userId: existingFinance.userId,
        proof: existingFinance.proof,
        status: existingFinance.status,
      },
      newData: null,
    },
  });
}
