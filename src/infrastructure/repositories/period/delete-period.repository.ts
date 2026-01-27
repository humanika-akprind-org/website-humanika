/**
 * Delete Period Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Delete a period
 */
export async function deletePeriod(id: string) {
  // Check if period exists
  const existingPeriod = await prisma.period.findUnique({
    where: { id },
    include: {
      managements: true,
      letters: true,
      workPrograms: true,
      events: true,
      articles: true,
    },
  });

  if (!existingPeriod) {
    throw new Error("Period not found");
  }

  // Check if period has related data
  const hasRelatedData =
    existingPeriod.managements.length > 0 ||
    existingPeriod.letters.length > 0 ||
    existingPeriod.workPrograms.length > 0 ||
    existingPeriod.events.length > 0 ||
    existingPeriod.articles.length > 0;

  if (hasRelatedData) {
    throw new Error("Cannot delete period with related data");
  }

  await prisma.period.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: "system",
    activityType: ActivityType.DELETE,
    entityType: "Period",
    entityId: id,
    description: `Deleted period: ${existingPeriod.name}`,
    metadata: {
      oldData: {
        name: existingPeriod.name,
        startYear: existingPeriod.startYear,
        endYear: existingPeriod.endYear,
        isActive: existingPeriod.isActive,
      },
      newData: null,
    },
  });
}
