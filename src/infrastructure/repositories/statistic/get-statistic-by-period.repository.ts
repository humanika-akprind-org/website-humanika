/**
 * Get Statistic By Period Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a statistic by period ID
 */
export async function getStatisticByPeriod(periodId: string) {
  return prisma.statistic.findFirst({
    where: { periodId },
    include: {
      period: true,
    },
  });
}
