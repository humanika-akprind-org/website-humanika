/**
 * Create Finance Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateFinanceCategoryInput } from "@/domain/value-objects/finance-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new finance category
 */
export async function createFinanceCategory(
  data: CreateFinanceCategoryInput,
  user: UserWithId,
) {
  const financeCategory = await prisma.financeCategory.create({
    data: {
      name: data.name,
      description: data.description,
      type: data.type,
    },
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
    activityType: ActivityType.CREATE,
    entityType: "FinanceCategory",
    entityId: financeCategory.id,
    description: `Created finance category: ${financeCategory.name}`,
    metadata: {
      newData: {
        name: financeCategory.name,
        description: financeCategory.description,
        type: financeCategory.type,
      },
    },
  });

  return financeCategory;
}
