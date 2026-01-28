/**
 * Get Active Period Statistic Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type Statistic } from "@/domain/entities/statistic.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get statistic for the active period
 */
export async function getActivePeriodStatistic() {
  const statistic = await prisma.statistic.findFirst({
    where: {
      period: {
        isActive: true,
      },
    },
    include: {
      period: true,
    },
  });

  return statistic as Statistic;
}
