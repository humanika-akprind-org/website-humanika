/**
 * Update Management Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import { prisma } from "@/presentation/lib/prisma";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing management
 */
export async function updateManagement(
  id: string,
  formData: ManagementServerData,
  user: UserWithId,
): Promise<Management> {
  // Check if management exists
  const existingManagement = await prisma.management.findUnique({
    where: { id },
  });

  if (!existingManagement) {
    throw new Error("Management not found");
  }

  const { userId, periodId, position, department, photo } = formData;

  // Check for conflicts (excluding current management)
  const existingUserManagement = await prisma.management.findFirst({
    where: {
      userId,
      periodId,
      NOT: { id },
    },
  });

  if (existingUserManagement) {
    throw new Error("User already has a management position in this period");
  }

  const existingPositionManagement = await prisma.management.findFirst({
    where: {
      periodId,
      position,
      department,
      NOT: { id },
    },
  });

  if (existingPositionManagement) {
    throw new Error(
      "This position in the department is already taken for this period",
    );
  }

  const management = await prisma.management.update({
    where: { id },
    data: {
      userId,
      periodId,
      position,
      department,
      photo,
    },
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
    description: `Updated management: ${management.user?.name || "Unknown"}`,
    metadata: {
      oldData: {
        userId: existingManagement.userId,
        position: existingManagement.position,
        periodId: existingManagement.periodId,
        photo: existingManagement.photo,
      },
      newData: {
        userId: management.userId,
        position: management.position,
        periodId: management.periodId,
        photo: management.photo,
      },
    },
  });

  return management as unknown as Management;
}
