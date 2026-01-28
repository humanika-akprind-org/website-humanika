/**
 * Get Statistic By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type Statistic } from "@/domain/entities/statistic.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a single statistic by ID
 */
export async function getStatistic(id: string) {
  const statistic = await prisma.statistic.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });

  return statistic as Statistic;
}
