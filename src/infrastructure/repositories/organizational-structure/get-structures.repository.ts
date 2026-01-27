/**
 * Get Structures Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import type { Status } from "@/domain/enums";

export type GetStructuresFilter = {
  status?: Status;
  periodId?: string;
  search?: string;
};

/**
 * Get all organizational structures with optional filters
 */
export async function getStructures(filter: GetStructuresFilter) {
  const where: Prisma.OrganizationalStructureWhereInput = {};

  if (filter.status) {
    where.status = { equals: filter.status as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.search) {
    where.OR = [{ name: { contains: filter.search, mode: "insensitive" } }];
  }

  const structures = await prisma.organizationalStructure.findMany({
    where,
    include: {
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return structures;
}
