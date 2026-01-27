/**
 * Create Management Repository - Write operation
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
 * Create a new management
 */
export async function createManagement(
  formData: ManagementServerData,
  user: UserWithId,
): Promise<Management> {
  const { userId, periodId, position, department, photo } = formData;

  // Check if user already has a management position in this period
  const existingManagement = await prisma.management.findFirst({
    where: {
      userId,
      periodId,
    },
  });

  if (existingManagement) {
    throw new Error("User already has a management position in this period");
  }

  // Check if position in department is already taken
  const existingPosition = await prisma.management.findFirst({
    where: {
      periodId,
      position,
      department,
    },
  });

  if (existingPosition) {
    throw new Error(
      "This position in the department is already taken for this period",
    );
  }

  const management = await prisma.management.create({
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
    activityType: ActivityType.CREATE,
    entityType: "Management",
    entityId: management.id,
    description: `Created management: ${management.user?.name || "Unknown"}`,
    metadata: {
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
