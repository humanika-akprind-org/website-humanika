/**
 * Delete Gallery Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a gallery
 */
export async function deleteGallery(id: string, user: UserWithId) {
  // Check if gallery exists
  const existingGallery = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!existingGallery) {
    throw new Error("Gallery not found");
  }

  await prisma.gallery.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Gallery",
    entityId: id,
    description: `Deleted gallery: ${existingGallery.title}`,
    metadata: {
      oldData: {
        title: existingGallery.title,
        eventId: existingGallery.eventId,
        categoryId: existingGallery.categoryId,
        periodId: existingGallery.periodId,
        image: existingGallery.image,
      },
      newData: null,
    },
  });
}
