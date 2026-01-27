import prisma from "@/lib/prisma";
import type { Period } from "@/types/period";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";

type CreatePeriodInput = {
  name: string;
  startYear: number;
  endYear: number;
  isActive?: boolean;
};

type UpdatePeriodInput = {
  name?: string;
  startYear?: number;
  endYear?: number;
  isActive?: boolean;
};

export const getPeriods = async (): Promise<Period[]> => {
  const periods = await prisma.period.findMany({
    orderBy: {
      startYear: "desc",
    },
  });

  return periods;
};

export const getPeriod = async (id: string): Promise<Period> => {
  const period = await prisma.period.findUnique({
    where: { id },
  });

  if (!period) {
    throw new Error("Period not found");
  }

  return period;
};

export const createPeriod = async (
  data: CreatePeriodInput
): Promise<Period> => {
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

  return period;
};

export const updatePeriod = async (
  id: string,
  data: UpdatePeriodInput
): Promise<Period> => {
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
};

export const deletePeriod = async (id: string): Promise<void> => {
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
};
