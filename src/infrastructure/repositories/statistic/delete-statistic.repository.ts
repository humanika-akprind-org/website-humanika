import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete Statistic Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

/**
 * Delete a statistic
 */
export async function deleteStatistic(id: string, user: UserWithId) {
  // Check if statistic exists
  const existingStatistic = await prisma.statistic.findUnique({
    where: { id },
    include: { period: true },
  });

  if (!existingStatistic) {
    throw new Error("Statistic not found");
  }

  await prisma.statistic.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Statistic",
    entityId: id,
    description: `Deleted statistic for period ${existingStatistic.period.name}`,
    metadata: {
      oldData: {
        activeMembers: existingStatistic.activeMembers,
        annualEvents: existingStatistic.annualEvents,
        periodId: existingStatistic.periodId,
      },
      newData: null,
    },
  });
}
