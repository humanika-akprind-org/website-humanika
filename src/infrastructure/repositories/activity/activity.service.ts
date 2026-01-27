import prisma from "@/lib/prisma";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";
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

export const getActivities = async (
  filters: ActivityFilters,
  pagination: { page: number; limit: number }
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
        filters.activityType as ActivityType
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

export const createActivity = async (
  data: {
    activityType: ActivityType;
    entityType: string;
    entityId?: string;
    description: string;
    metadata?: unknown;
  },
  user: Pick<User, "id"> | null,
  ipAddress: string,
  userAgent: string
) => {
  // Validate required fields
  if (!data.activityType || !data.entityType || !data.description) {
    throw new Error("Missing required fields");
  }

  const activity = await prisma.activityLog.create({
    data: {
      userId: user?.id || null,
      activityType: data.activityType,
      entityType: data.entityType,
      entityId: data.entityId,
      description: data.description,
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      metadata: data.metadata as any,
      ipAddress,
      userAgent,
    },
  });

  return activity;
};
