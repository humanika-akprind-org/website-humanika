/**
 * Update Gallery Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateGalleryCategoryInput } from "@/domain/value-objects/gallery-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Update an existing gallery category
 */
export async function updateGalleryCategory(
  id: string,
  data: UpdateGalleryCategoryInput,
  user: UserWithId,
) {
  // Get existing category for logging
  const existingCategory = await prisma.galleryCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Gallery category not found");
  }

  const category = await prisma.galleryCategory.update({
    where: { id },
    data,
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "GalleryCategory",
    entityId: category.id,
    description: `Updated gallery category: ${category.name}`,
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

  return category;
}
