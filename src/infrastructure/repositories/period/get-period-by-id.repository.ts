/**
 * Get Period By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type Period } from "@/domain/entities/period.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a single period by ID
 */
export async function getPeriod(id: string) {
  const period = await prisma.period.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  return period as Period;
}
