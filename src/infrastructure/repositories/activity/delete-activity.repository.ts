/**
 * Delete Activity Repository - Delete operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Delete activity by ID
 */
export const deleteActivity = async (id: string): Promise<void> => {
  await prisma.activityLog.delete({
    where: { id },
  });
};
