/**
 * Update Department Task Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  DepartmentTask,
  UpdateDepartmentTaskInput,
} from "@/domain/entities/task-department.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing department task
 */
export async function updateDepartmentTask(
  id: string,
  data: UpdateDepartmentTaskInput,
  user: UserWithId,
) {
  // Get existing task for logging
  const existingTask = await prisma.departmentTask.findUnique({
    where: { id },
  });

  if (!existingTask) {
    throw new Error("Department task not found");
  }

  const departmentTaskData: Prisma.DepartmentTaskUncheckedUpdateInput = {};
  if (data.title !== undefined) departmentTaskData.title = data.title;
  if (data.subtitle !== undefined) departmentTaskData.subtitle = data.subtitle;
  if (data.note !== undefined) departmentTaskData.note = data.note;
  if (data.department !== undefined) {
    departmentTaskData.department = data.department;
  }
  if (data.userId !== undefined) departmentTaskData.userId = data.userId;
  if (data.workProgramId !== undefined) {
    departmentTaskData.workProgramId = data.workProgramId;
  }
  if (data.status !== undefined) departmentTaskData.status = data.status;

  const departmentTask = await prisma.departmentTask.update({
    where: { id },
    data: departmentTaskData,
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

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "DepartmentTask",
    entityId: departmentTask.id,
    description: `Updated department task: ${departmentTask.title}`,
    metadata: {
      oldData: {
        title: existingTask.title,
        subtitle: existingTask.subtitle,
        note: existingTask.note,
        department: existingTask.department,
        userId: existingTask.userId,
        workProgramId: existingTask.workProgramId,
        status: existingTask.status,
      },
      newData: {
        title: departmentTask.title,
        subtitle: departmentTask.subtitle,
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        workProgramId: departmentTask.workProgramId,
        status: departmentTask.status,
      },
    },
  });

  return departmentTask as DepartmentTask;
}
