/**
 * Create Gallery Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateGalleryCategoryInput } from "@/domain/value-objects/gallery-category";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

/**
 * Create a new gallery category
 */
export async function createGalleryCategory(
  data: CreateGalleryCategoryInput,
  user: UserWithId,
) {
  const category = await prisma.galleryCategory.create({
    data,
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "GalleryCategory",
    entityId: category.id,
    description: `Created gallery category: ${category.name}`,
    metadata: {
      newData: {
        name: category.name,
        description: category.description,
      },
    },
  });

  return category;
}
