/**
 * Get Active Period Statistic Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get statistic for the active period
 */
export async function getActivePeriodStatistic() {
  return prisma.statistic.findFirst({
    where: {
      period: {
        isActive: true,
      },
    },
    include: {
      period: true,
    },
  });
}
