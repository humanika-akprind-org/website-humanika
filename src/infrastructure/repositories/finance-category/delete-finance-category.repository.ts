/**
 * Delete Finance Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a finance category
 */
export async function deleteFinanceCategory(id: string, user: UserWithId) {
  // Check if finance category exists
  const existingFinanceCategory = await prisma.financeCategory.findUnique({
    where: { id },
  });

  if (!existingFinanceCategory) {
    throw new Error("Finance category not found");
  }

  await prisma.financeCategory.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "FinanceCategory",
    entityId: id,
    description: `Deleted finance category: ${existingFinanceCategory.name}`,
    metadata: {
      oldData: {
        name: existingFinanceCategory.name,
        description: existingFinanceCategory.description,
        type: existingFinanceCategory.type,
      },
      newData: null,
    },
  });
}
