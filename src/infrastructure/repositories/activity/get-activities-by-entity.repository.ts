/**
 * Get Activities By Entity Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ActivityLog } from "@/domain/entities/activity-log.entity";

/**
 * Get activities by entity
 */
export const getActivitiesByEntity = async (
  entityType: string,
  entityId: string,
): Promise<ActivityLog[]> => {
  const activities = await prisma.activityLog.findMany({
    where: {
      entityType,
      entityId,
    },
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
