/**
 * Create Event Category Repository
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the function to create a new event category.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  EventCategory,
  CreateEventCategoryInput,
} from "@/domain/value-objects/event-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Type alias for user context
 */
type UserWithId = { id: string };

/**
 * Create a new event category with activity logging
 */
export async function createEventCategory(
  data: CreateEventCategoryInput,
  user: UserWithId,
): Promise<EventCategory> {
  const category = await prisma.eventCategory.create({
    data: {
      name: data.name,
      description: data.description || null,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "EventCategory",
    entityId: category.id,
    description: `Created event category: ${category.name}`,
    metadata: {
      newData: {
        name: category.name,
        description: category.description,
      },
    },
  });

  return category as unknown as EventCategory;
}
