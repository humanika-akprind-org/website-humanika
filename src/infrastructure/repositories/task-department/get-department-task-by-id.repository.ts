/**
 * Get Department Task By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { type DepartmentTask } from "@/domain/entities/task-department.entity";
import prisma from "@/presentation/lib/prisma";

/**
 * Get a single department task by ID
 */
export async function getDepartmentTask(id: string) {
  const departmentTask = await prisma.departmentTask.findUnique({
    where: { id },
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
  });

  if (!departmentTask) {
    throw new Error("Department task not found");
  }

  return departmentTask as DepartmentTask;
}
