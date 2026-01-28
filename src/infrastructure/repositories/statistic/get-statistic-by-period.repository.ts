/**
 * Get Statistic By Period Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type Statistic } from "@/domain/entities/statistic.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a statistic by period ID
 */
export async function getStatisticByPeriod(periodId: string) {
  const statistic = await prisma.statistic.findFirst({
    where: { periodId },
    include: {
      period: true,
    },
  });

  return statistic as Statistic;
}
