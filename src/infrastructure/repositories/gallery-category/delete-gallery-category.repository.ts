/**
 * Delete Gallery Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Delete a gallery category
 */
export async function deleteGalleryCategory(id: string, user: UserWithId) {
  // Check if category exists
  const existingCategory = await prisma.galleryCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Gallery category not found");
  }

  await prisma.galleryCategory.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "GalleryCategory",
    entityId: id,
    description: `Deleted gallery category: ${existingCategory.name}`,
    metadata: {
      oldData: {
        name: existingCategory.name,
        description: existingCategory.description,
      },
      newData: null,
    },
  });
}
