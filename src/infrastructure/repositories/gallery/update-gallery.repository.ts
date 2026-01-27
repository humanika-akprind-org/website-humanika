/**
 * Update Gallery Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

export type UpdateGalleryInput = {
  title?: string;
  eventId?: string;
  categoryId?: string;
  periodId?: string;
  image?: string;
};

/**
 * Update an existing gallery
 */
export async function updateGallery(
  id: string,
  data: UpdateGalleryInput,
  user: UserWithId,
) {
  // Check if gallery exists
  const existingGallery = await prisma.gallery.findUnique({
    where: { id },
  });

  if (!existingGallery) {
    throw new Error("Gallery not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.title !== undefined) updateData.title = data.title;
  if (data.eventId !== undefined) updateData.eventId = data.eventId;
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId;
  if (data.periodId !== undefined) updateData.periodId = data.periodId;
  if (data.image !== undefined) updateData.image = data.image;

  const gallery = await prisma.gallery.update({
    where: { id },
    data: updateData,
    include: {
      event: true,
      category: true,
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Gallery",
    entityId: gallery.id,
    description: `Updated gallery: ${gallery.title}`,
    metadata: {
      oldData: {
        title: existingGallery.title,
        eventId: existingGallery.eventId,
        categoryId: existingGallery.categoryId,
        periodId: existingGallery.periodId,
        image: existingGallery.image,
      },
      newData: {
        title: gallery.title,
        eventId: gallery.eventId,
        categoryId: gallery.categoryId,
        periodId: gallery.periodId,
        image: gallery.image,
      },
    },
  });

  return gallery;
}
