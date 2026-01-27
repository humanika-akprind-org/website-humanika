/**
 * Get Statistic By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single statistic by ID
 */
export async function getStatistic(id: string) {
  return prisma.statistic.findUnique({
    where: { id },
    include: {
      period: true,
    },
  });
}
