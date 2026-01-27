/**
 * Get Activity By ID Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ActivityLog } from "@/domain/entities/activity-log.entity";

/**
 * Find activity by ID
 */
export const getActivityById = async (
  id: string,
): Promise<ActivityLog | null> => {
  const activity = await prisma.activityLog.findUnique({
    where: { id },
    include: {
      user: {
        select: {
          name: true,
          email: true,
        },
      },
    },
  });
  return activity as unknown as ActivityLog | null;
};
