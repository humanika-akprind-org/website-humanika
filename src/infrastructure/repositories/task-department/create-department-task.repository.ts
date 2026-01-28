/**
 * Create Department Task Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
} from "@/domain/entities/task-department.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new department task
 */
export async function createDepartmentTask(
  data: CreateDepartmentTaskInput,
  user: UserWithId,
) {
  const departmentTaskData: Prisma.DepartmentTaskCreateInput = {
    title: data.title,
    subtitle: data.subtitle,
    note: data.note,
    department: data.department,
    ...(data.userId && { user: { connect: { id: data.userId } } }),
    ...(data.workProgramId && {
      workProgram: { connect: { id: data.workProgramId } },
    }),
    status: data.status || "PENDING",
  };

  const departmentTask = await prisma.departmentTask.create({
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
    activityType: ActivityType.CREATE,
    entityType: "DepartmentTask",
    entityId: departmentTask.id,
    description: `Created department task: ${departmentTask.title}`,
    metadata: {
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
