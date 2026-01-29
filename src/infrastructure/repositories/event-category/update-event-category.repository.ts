/**
 * Update Event Category Repository
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the function to update an existing event category.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  EventCategory,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Type alias for user context
 */
type UserWithId = { id: string };

/**
 * Update an existing event category with activity logging
 */
export async function updateEventCategory(
  id: string,
  data: UpdateEventCategoryInput,
  user: UserWithId,
): Promise<EventCategory> {
  // Get existing category for logging
  const existingCategory = await prisma.eventCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Event category not found");
  }

  const category = await prisma.eventCategory.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description ?? null,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "EventCategory",
    entityId: category.id,
    description: `Updated event category: ${category.name}`,
    metadata: {
      oldData: {
        name: existingCategory.name,
        description: existingCategory.description,
      },
      newData: {
        name: category.name,
        description: category.description,
      },
    },
  });

  return category as unknown as EventCategory;
}
