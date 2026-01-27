/**
 * Get Periods Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get all periods
 */
export async function getPeriods() {
  const periods = await prisma.period.findMany({
    orderBy: {
      startYear: "desc",
    },
  });

  return periods;
}
