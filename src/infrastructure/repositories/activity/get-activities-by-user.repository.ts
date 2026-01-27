/**
 * Get Activities By User ID Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ActivityLog } from "@/domain/entities/activity-log.entity";

/**
 * Get activities by user ID
 */
export const getActivitiesByUserId = async (
  userId: string,
): Promise<ActivityLog[]> => {
  const activities = await prisma.activityLog.findMany({
    where: { userId },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return activities as unknown as ActivityLog[];
};
