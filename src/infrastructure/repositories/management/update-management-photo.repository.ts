/**
 * Update Management Photo Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type { Management } from "@/domain/entities/management.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update management photo
 */
export async function updateManagementPhoto(
  id: string,
  photoUrl: string,
  user: UserWithId,
): Promise<Management> {
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

  const management = await prisma.management.update({
    where: { id },
    data: { photo: photoUrl },
    include: {
      user: true,
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Management",
    entityId: management.id,
    description: `Updated management photo: ${management.user?.name || "Unknown"}`,
    metadata: {
      oldData: {
        photo: existingManagement.photo,
      },
      newData: {
        photo: photoUrl,
      },
    },
  });

  return management as unknown as Management;
}
