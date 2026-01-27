/**
 * Delete Department Task Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a department task
 */
export async function deleteDepartmentTask(id: string, user: UserWithId) {
  // Check if task exists
  const departmentTask = await prisma.departmentTask.findUnique({
    where: { id },
  });

  if (!departmentTask) {
    throw new Error("Department task not found");
  }

  await prisma.departmentTask.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "DepartmentTask",
    entityId: id,
    description: `Deleted department task: ${departmentTask.title}`,
    metadata: {
      oldData: {
        title: departmentTask.title,
        subtitle: departmentTask.subtitle,
        note: departmentTask.note,
        department: departmentTask.department,
        userId: departmentTask.userId,
        workProgramId: departmentTask.workProgramId,
        status: departmentTask.status,
      },
      newData: null,
    },
  });
}
