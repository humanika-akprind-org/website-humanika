/**
 * Update Period Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UpdatePeriodInput = {
  name?: string;
  startYear?: number;
  endYear?: number;
  isActive?: boolean;
};

/**
 * Update an existing period
 */
export async function updatePeriod(id: string, data: UpdatePeriodInput) {
  // Check if period exists
  const existingPeriod = await prisma.period.findUnique({
    where: { id },
  });

  if (!existingPeriod) {
    throw new Error("Period not found");
  }

  const { name, startYear, endYear, isActive } = data;

  // Validation
  if (
    startYear !== undefined &&
    endYear !== undefined &&
    startYear >= endYear
  ) {
    throw new Error("Start year must be less than end year");
  }

  // If setting this period as active, deactivate all others
  if (isActive) {
    await prisma.period.updateMany({
      where: {
        isActive: true,
        id: { not: id },
      },
      data: { isActive: false },
    });
  }

  const period = await prisma.period.update({
    where: { id },
    data: {
      ...(name !== undefined && { name }),
      ...(startYear !== undefined && { startYear }),
      ...(endYear !== undefined && { endYear }),
      ...(isActive !== undefined && { isActive }),
    },
  });

  // Log activity
  await logActivity({
    userId: "system",
    activityType: ActivityType.UPDATE,
    entityType: "Period",
    entityId: period.id,
    description: `Updated period: ${period.name}`,
    metadata: {
      oldData: {
        name: existingPeriod.name,
        startYear: existingPeriod.startYear,
        endYear: existingPeriod.endYear,
        isActive: existingPeriod.isActive,
      },
      newData: {
        name: period.name,
        startYear: period.startYear,
        endYear: period.endYear,
        isActive: period.isActive,
      },
    },
  });

  return period;
}
