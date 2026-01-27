/**
 * Delete Management Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a management
 */
export async function deleteManagement(
  id: string,
  user: UserWithId,
): Promise<void> {
  // Check if management exists
  const existingManagement = await prisma.management.findUnique({
    where: { id },
    include: {
      user: true,
    },
  });

  if (!existingManagement) {
    throw new Error("Management not found");
  }

  await prisma.management.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Management",
    entityId: id,
    description: `Deleted management: ${
      existingManagement.user?.name || "Unknown"
    }`,
    metadata: {
      oldData: {
        userId: existingManagement.userId,
        position: existingManagement.position,
        periodId: existingManagement.periodId,
        photo: existingManagement.photo,
      },
      newData: null,
    },
  });
}
