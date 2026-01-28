/**
 * Get Work Programs Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Status, Department } from "@/domain/enums";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";
import { type WorkProgram } from "@/domain/entities/work-program.entity";

export type GetWorkProgramsFilter = {
  department?: Department;
  status?: Status;
  periodId?: string;
  search?: string;
};

/**
 * Get all work programs with optional filters
 */
export async function getWorkPrograms(filter?: GetWorkProgramsFilter) {
  const where: Prisma.WorkProgramWhereInput = {};

  if (filter?.department) where.department = { equals: filter.department };
  if (filter?.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter?.periodId) where.periodId = filter.periodId;
  if (filter?.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { goal: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const workPrograms = await prisma.workProgram.findMany({
    where,
    include: {
      period: true,
      responsible: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
      approvals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return workPrograms as unknown as WorkProgram[];
}
