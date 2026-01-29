/**
 * Get Managements Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type { Management } from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";

/**
 * Filter options for querying managements
 */
export interface ManagementFilter {
  department?: Department;
  position?: Position;
  periodId?: string;
  userId?: string;
  search?: string;
}

/**
 * Get all managements with optional filter
 */
export async function getManagements(
  filter?: ManagementFilter,
): Promise<Management[]> {
  const where: Record<string, unknown> = {};

  if (filter?.department) {
    where.department = filter.department;
  }

  if (filter?.position) {
    where.position = filter.position;
  }

  if (filter?.periodId) {
    where.periodId = filter.periodId;
  }

  if (filter?.userId) {
    where.userId = filter.userId;
  }

  // Search by user name or email
  if (filter?.search) {
    where.user = {
      OR: [
        { name: { contains: filter.search, mode: "insensitive" } },
        { email: { contains: filter.search, mode: "insensitive" } },
      ],
    };
  }

  const managements = await prisma.management.findMany({
    where,
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
