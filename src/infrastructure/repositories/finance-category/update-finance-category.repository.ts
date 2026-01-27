/**
 * Update Finance Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateFinanceCategoryInput } from "@/domain/value-objects/finance-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing finance category
 */
export async function updateFinanceCategory(
  id: string,
  data: UpdateFinanceCategoryInput,
  user: UserWithId,
) {
  // Check if finance category exists
  const existingFinanceCategory = await prisma.financeCategory.findUnique({
    where: { id },
  });

  if (!existingFinanceCategory) {
    throw new Error("Finance category not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type) updateData.type = data.type;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const financeCategory = await prisma.financeCategory.update({
    where: { id },
    data: updateData,
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "FinanceCategory",
    entityId: financeCategory.id,
    description: `Updated finance category: ${financeCategory.name}`,
    metadata: {
      oldData: {
        name: existingFinanceCategory.name,
        description: existingFinanceCategory.description,
        type: existingFinanceCategory.type,
      },
      newData: {
        name: financeCategory.name,
        description: financeCategory.description,
        type: financeCategory.type,
      },
    },
  });

  return financeCategory;
}
