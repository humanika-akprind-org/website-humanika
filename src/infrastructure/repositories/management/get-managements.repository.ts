/**
 * Get Managements Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type { Management } from "@/domain/entities/management.entity";

/**
 * Get all managements with their user and period
 */
export async function getManagements(): Promise<Management[]> {
  const managements = await prisma.management.findMany({
    include: {
      user: true,
      period: true,
    },
    orderBy: {
      department: "asc",
    },
  });

  return managements as unknown as Management[];
}
