import prisma from "@/lib/prisma";
import type {
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticFilter,
} from "@/types/statistic";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";
import type { Prisma } from "@prisma/client";

type UserWithId = Pick<User, "id">;

export const getStatistics = async (filter?: StatisticFilter) => {
  const where: Prisma.StatisticWhereInput = {};

  if (filter?.periodId) {
    where.periodId = filter.periodId;
  }

  return prisma.statistic.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });
};

export const getStatistic = async (id: string) =>
  prisma.statistic.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });

export const getStatisticByPeriod = async (periodId: string) =>
  prisma.statistic.findFirst({
    where: { periodId },
    include: {
      period: true,
    },
  });

export const getActivePeriodStatistic = async () =>
  prisma.statistic.findFirst({
    where: {
      period: {
        isActive: true,
      },
    },
    include: {
      period: true,
    },
  });

export const createStatistic = async (
  data: CreateStatisticInput,
  user: UserWithId
) => {
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

  return statistic;
};

export const updateStatistic = async (
  id: string,
  data: UpdateStatisticInput,
  user: UserWithId
) => {
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

  return statistic;
};

export const deleteStatistic = async (id: string, user: UserWithId) => {
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
};
