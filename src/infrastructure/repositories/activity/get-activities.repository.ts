/**
 * Get Activities Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { ActivityType } from "@/domain/enums";
import type { ActivityType as PrismaActivityType } from "@prisma/client";

export interface ActivityFilters {
  activityType?: ActivityType | "ALL";
  startDate?: string;
  endDate?: string;
}

export interface ActivityPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface ActivityResponse {
  activities: Array<{
    id: string;
    userId: string | null;
    activityType: PrismaActivityType;
    entityType: string;
    entityId: string | null;
    description: string;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    metadata: any;
    ipAddress: string | null;
    userAgent: string | null;
    createdAt: Date;
    user: {
      name: string;
      email: string;
    } | null;
  }>;
  pagination: ActivityPagination;
}

/**
 * Get all activities with optional filters and pagination
 */
export const getActivities = async (
  filters: ActivityFilters,
  pagination: { page: number; limit: number },
): Promise<ActivityResponse> => {
  const { page, limit } = pagination;
  const skip = (page - 1) * limit;

  // Build where clause based on filters
  const where: {
    activityType?: ActivityType;
    createdAt?: {
      gte: Date;
      lte: Date;
    };
  } = {};

  if (filters.activityType && filters.activityType !== "ALL") {
    // Validate activity type
    if (
      !Object.values(ActivityType).includes(
        filters.activityType as ActivityType,
      )
    ) {
      throw new Error("Invalid activity type");
    }
    where.activityType = filters.activityType as ActivityType;
  }

  if (filters.startDate && filters.endDate) {
    where.createdAt = {
      gte: new Date(filters.startDate),
      lte: new Date(filters.endDate),
    };
  }

  // Get activities with pagination
  const [activities, total] = await Promise.all([
    prisma.activityLog.findMany({
      where,
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
      skip,
      take: limit,
    }),
    prisma.activityLog.count({ where }),
  ]);

  return {
    activities,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    },
  };
};
