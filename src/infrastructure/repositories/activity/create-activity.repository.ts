/**
 * Create Activity Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { type ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

/**
 * Create a new activity log entry
 */
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
  userAgent: string,
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
