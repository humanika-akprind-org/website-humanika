import prisma from "@/presentation/lib/prisma";
import type { StatisticStats } from "@/application/interface/statistic.repository.interface";
import type { Prisma } from "@prisma/client";

/**
 * Get Statistic Stats Repository - Aggregate statistics
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

/**
 * Get aggregated statistics
 */
export async function getStatisticStats(
  where?: Record<string, unknown>,
): Promise<StatisticStats> {
  const filter: Prisma.StatisticWhereInput = {};

  if (where?.periodId) {
    filter.periodId = where.periodId as string;
  }

  // Get all statistics with the filter applied
  const statistics = await prisma.statistic.findMany({
    where: filter,
  });

  // Calculate aggregates
  const total = statistics.length;
  const totalActiveMembers = statistics.reduce(
    (sum, stat) => sum + (stat.activeMembers || 0),
    0,
  );
  const totalAnnualEvents = statistics.reduce(
    (sum, stat) => sum + (stat.annualEvents || 0),
    0,
  );
  const totalCollaborativeProjects = statistics.reduce(
    (sum, stat) => sum + (stat.collaborativeProjects || 0),
    0,
  );
  const totalInnovationProjects = statistics.reduce(
    (sum, stat) => sum + (stat.innovationProjects || 0),
    0,
  );
  const totalAwards = statistics.reduce(
    (sum, stat) => sum + (stat.awards || 0),
    0,
  );
  const totalLearningMaterials = statistics.reduce(
    (sum, stat) => sum + (stat.learningMaterials || 0),
    0,
  );

  // Calculate average member satisfaction
  const satisfactionValues = statistics
    .filter((stat) => stat.memberSatisfaction !== null)
    .map((stat) => stat.memberSatisfaction!);
  const avgMemberSatisfaction =
    satisfactionValues.length > 0
      ? satisfactionValues.reduce((sum, val) => sum + val, 0) /
        satisfactionValues.length
      : 0;

  return {
    total,
    totalActiveMembers,
    totalAnnualEvents,
    totalCollaborativeProjects,
    totalInnovationProjects,
    totalAwards,
    totalLearningMaterials,
    avgMemberSatisfaction: Math.round(avgMemberSatisfaction * 100) / 100,
  };
}
