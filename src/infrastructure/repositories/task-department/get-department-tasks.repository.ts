/**
 * Get Department Tasks Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Department, Status } from "@/domain/enums";
import type { Prisma } from "@prisma/client";

export type DepartmentTaskFilter = {
  department?: Department;
  status?: Status;
  userId?: string;
  search?: string;
};

/**
 * Get all department tasks with optional filters
 */
export async function getDepartmentTasks(filter: DepartmentTaskFilter) {
  const where: Prisma.DepartmentTaskWhereInput = {};

  if (filter.department) where.department = filter.department;
  if (filter.status) {
    where.status = filter.status;
  }
  if (filter.userId) where.userId = filter.userId;
  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { subtitle: { contains: filter.search, mode: "insensitive" } },
      { note: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const departmentTasks = await prisma.departmentTask.findMany({
    where,
    include: {
      user: {
        select: {
          id: true,
          name: true,
          email: true,
        },
      },
      workProgram: {
        select: {
          id: true,
          name: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return departmentTasks;
}
