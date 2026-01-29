/**
 * Delete Event Category Repository
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the function to delete an event category.
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Type alias for user context
 */
type UserWithId = { id: string };

/**
 * Delete an event category with activity logging
 */
export async function deleteEventCategory(
  id: string,
  user: UserWithId,
): Promise<void> {
  // Check if category exists
  const existingCategory = await prisma.eventCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Event category not found");
  }

  await prisma.eventCategory.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "EventCategory",
    entityId: id,
    description: `Deleted event category: ${existingCategory.name}`,
    metadata: {
      oldData: {
        name: existingCategory.name,
        description: existingCategory.description,
      },
      newData: null,
    },
  });
}
