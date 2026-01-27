/**
 * Get Finance Categories Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { FinanceType } from "@/domain/enums";
import type { Prisma } from "@prisma/client";

export type GetFinanceCategoriesFilter = {
  type?: FinanceType;
  isActive?: string;
  search?: string;
};

/**
 * Get all finance categories with optional filters
 */
export async function getFinanceCategories(filter: GetFinanceCategoriesFilter) {
  const where: Prisma.FinanceCategoryWhereInput = {};

  if (filter.type) where.type = { equals: filter.type };
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const financeCategories = await prisma.financeCategory.findMany({
    where,
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return financeCategories;
}
