/**
 * Create Period Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import { type Period } from "@/domain/entities/period.entity";

type CreatePeriodInput = {
  name: string;
  startYear: number;
  endYear: number;
  isActive?: boolean;
};

/**
 * Create a new period
 */
export async function createPeriod(data: CreatePeriodInput) {
  const { name, startYear, endYear, isActive = false } = data;

  // Validation
  if (!name || !startYear || !endYear) {
    throw new Error("Missing required fields");
  }

  if (startYear >= endYear) {
    throw new Error("Start year must be less than end year");
  }

  // If setting this period as active, deactivate all others
  if (isActive) {
    await prisma.period.updateMany({
      where: { isActive: true },
      data: { isActive: false },
    });
  }

  const period = await prisma.period.create({
    data: {
      name,
      startYear,
      endYear,
      isActive,
    },
  });

  // Log activity
  await logActivity({
    userId: "system",
    activityType: ActivityType.CREATE,
    entityType: "Period",
    entityId: period.id,
    description: `Created period: ${period.name}`,
    metadata: {
      newData: {
        name: period.name,
        startYear: period.startYear,
        endYear: period.endYear,
        isActive: period.isActive,
      },
    },
  });

  return period as Period;
}
