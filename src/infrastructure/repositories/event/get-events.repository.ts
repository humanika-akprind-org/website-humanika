/**
 * Get Events Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { EventFilter } from "@/domain/entities/event.entity";
import type { Prisma, Status as PrismaStatus } from "@prisma/client";

// Type for schedule filter conditions (used for JSON array filtering)
type ScheduleFilterCondition = {
  date?: {
    gte?: string;
    lte?: string;
  };
  location?: {
    contains: string;
    mode: "insensitive";
  };
};

// Helper function to create JSON array filter for schedules
function buildSchedulesFilter(condition: ScheduleFilterCondition) {
  return {
    path: "",
    array_contains: condition,
  } as Record<string, unknown>;
}

/**
 * Get all events with optional filters
 */
export const getEvents = async (filter: EventFilter) => {
  const where: Prisma.EventWhereInput = {};

  if (filter.department) where.department = { equals: filter.department };
  if (filter.status) {
    where.status = { equals: filter.status as unknown as PrismaStatus };
  }
  if (filter.periodId) where.periodId = filter.periodId;
  if (filter.workProgramId) where.workProgramId = filter.workProgramId;

  const orConditions: Prisma.EventWhereInput[] = [];

  if (filter.search) {
    orConditions.push(
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
      { goal: { contains: filter.search, mode: "insensitive" } },
    );
  }

  // Handle date range filtering based on schedules
  if (filter.scheduleStartDate || filter.scheduleEndDate) {
    const rangeStart = filter.scheduleStartDate
      ? new Date(filter.scheduleStartDate)
      : undefined;
    const rangeEnd = filter.scheduleEndDate
      ? new Date(filter.scheduleEndDate)
      : undefined;

    const dateFilter: ScheduleFilterCondition = {};

    if (rangeStart && rangeEnd) {
      dateFilter.date = {
        gte: rangeStart.toISOString(),
        lte: rangeEnd.toISOString(),
      };
    } else if (rangeStart) {
      dateFilter.date = {
        gte: rangeStart.toISOString(),
      };
    } else if (rangeEnd) {
      dateFilter.date = {
        lte: rangeEnd.toISOString(),
      };
    }

    orConditions.push({
      schedules: buildSchedulesFilter(dateFilter),
    });
  }

  // Handle specific date filtering
  if (filter.date) {
    const targetDate = new Date(filter.date);
    const startOfDay = new Date(targetDate);
    startOfDay.setHours(0, 0, 0, 0);
    const endOfDay = new Date(targetDate);
    endOfDay.setHours(23, 59, 59, 999);

    orConditions.push({
      schedules: buildSchedulesFilter({
        date: {
          gte: startOfDay.toISOString(),
          lte: endOfDay.toISOString(),
        },
      }),
    });
  }

  // Handle location filtering
  if (filter.location) {
    orConditions.push({
      schedules: buildSchedulesFilter({
        location: {
          contains: filter.location,
          mode: "insensitive",
        },
      }),
    });
  }

  if (orConditions.length > 0) {
    where.OR = orConditions;
  }

  const events = await prisma.event.findMany({
    where,
    include: {
      period: true,
      responsible: {
        select: {
          id: true,
          name: true,
          email: true,
          department: true,
        },
      },
      workProgram: {
        select: {
          id: true,
          name: true,
        },
      },
      category: true,
      approvals: {
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      },
      galleries: true,
      letters: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return events;
};
