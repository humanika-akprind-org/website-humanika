/**
 * Get Statistics Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  Statistic,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";
import type { Prisma } from "@prisma/client";

/**
 * Get all statistics with optional filter
 */
export async function getStatistics(filter?: StatisticFilter) {
  const where: Prisma.StatisticWhereInput = {};

  if (filter?.periodId) {
    where.periodId = filter.periodId;
  }

  const statistics = await prisma.statistic.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return statistics as Statistic[];
}
