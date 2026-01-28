/**
 * Create Statistic Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  CreateStatisticInput,
  Statistic,
} from "@/domain/entities/statistic.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new statistic
 */
export async function createStatistic(
  data: CreateStatisticInput,
  user: UserWithId,
) {
  const statistic = await prisma.statistic.create({
    data: {
      activeMembers: data.activeMembers ?? 0,
      annualEvents: data.annualEvents ?? 0,
      collaborativeProjects: data.collaborativeProjects ?? 0,
      innovationProjects: data.innovationProjects ?? 0,
      awards: data.awards ?? 0,
      memberSatisfaction: data.memberSatisfaction ?? 0,
      learningMaterials: data.learningMaterials ?? 0,
      periodId: data.periodId,
    },
    include: {
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Statistic",
    entityId: statistic.id,
    description: `Created statistic for period ${statistic.period.name}`,
    metadata: {
      newData: {
        activeMembers: statistic.activeMembers,
        annualEvents: statistic.annualEvents,
        periodId: statistic.periodId,
      },
    },
  });

  return statistic as Statistic;
}
