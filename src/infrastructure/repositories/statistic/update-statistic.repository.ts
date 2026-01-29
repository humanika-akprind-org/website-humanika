import prisma from "@/presentation/lib/prisma";
import type {
  Statistic,
  UpdateStatisticInput,
} from "@/domain/entities/statistic.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update Statistic Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

/**
 * Update an existing statistic
 */
export async function updateStatistic(
  id: string,
  data: UpdateStatisticInput,
  user: UserWithId,
) {
  // Get existing statistic
  const existingStatistic = await prisma.statistic.findUnique({
    where: { id },
    include: { period: true },
  });

  if (!existingStatistic) {
    throw new Error("Statistic not found");
  }

  const statistic = await prisma.statistic.update({
    where: { id },
    data: {
      activeMembers: data.activeMembers ?? existingStatistic.activeMembers,
      annualEvents: data.annualEvents ?? existingStatistic.annualEvents,
      collaborativeProjects:
        data.collaborativeProjects ?? existingStatistic.collaborativeProjects,
      innovationProjects:
        data.innovationProjects ?? existingStatistic.innovationProjects,
      awards: data.awards ?? existingStatistic.awards,
      memberSatisfaction:
        data.memberSatisfaction ?? existingStatistic.memberSatisfaction,
      learningMaterials:
        data.learningMaterials ?? existingStatistic.learningMaterials,
      periodId: data.periodId ?? existingStatistic.periodId,
    },
    include: {
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Statistic",
    entityId: statistic.id,
    description: `Updated statistic for period ${statistic.period.name}`,
    metadata: {
      oldData: {
        activeMembers: existingStatistic.activeMembers,
        annualEvents: existingStatistic.annualEvents,
        periodId: existingStatistic.periodId,
      },
      newData: {
        activeMembers: statistic.activeMembers,
        annualEvents: statistic.annualEvents,
        periodId: statistic.periodId,
      },
    },
  });

  return statistic as Statistic;
}
