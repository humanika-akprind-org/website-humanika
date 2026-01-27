/**
 * Get Finances Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { FinanceType, Status } from "@/domain/enums";
import type {
  Prisma,
  Status as PrismaStatus,
  FinanceType as PrismaFinanceType,
} from "@prisma/client";

export type GetFinancesFilter = {
  type?: FinanceType;
  status?: Status;
  workProgramId?: string;
  categoryId?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Get all finances with optional filters
 */
export async function getFinances(filter: GetFinancesFilter) {
  const where: Prisma.FinanceWhereInput = {};

  if (filter.type) {
    where.type = { equals: filter.type as PrismaFinanceType };
  }
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.workProgramId) where.workProgramId = filter.workProgramId;
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.userId) where.userId = filter.userId;
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }
  if (filter.startDate || filter.endDate) {
    where.date = {};
    if (filter.startDate) where.date.gte = new Date(filter.startDate);
    if (filter.endDate) where.date.lte = new Date(filter.endDate);
  }

  const finances = await prisma.finance.findMany({
    where,
    include: {
      workProgram: {
        select: {
          id: true,
          name: true,
        },
      },
      category: true,
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      approvals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
              department: true,
            },
          },
        },
        orderBy: { updatedAt: "desc" },
      },
    },
    orderBy: { date: "desc" },
  });

  return finances;
}
