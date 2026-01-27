/**
 * Create Gallery Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { User } from "@/domain/entities/user.entity";

type UserWithId = Pick<User, "id">;

export type CreateGalleryInput = {
  title: string;
  eventId: string;
  categoryId?: string;
  periodId?: string;
  image: string;
};

/**
 * Create a new gallery
 */
export async function createGallery(
  data: CreateGalleryInput,
  user: UserWithId,
) {
  const galleryData: Prisma.GalleryCreateInput = {
    title: data.title,
    event: { connect: { id: data.eventId } },
    image: data.image,
  };

  if (data.categoryId) {
    galleryData.category = { connect: { id: data.categoryId } };
  }

  if (data.periodId) {
    galleryData.period = { connect: { id: data.periodId } };
  }

  const gallery = await prisma.gallery.create({
    data: galleryData,
    include: {
      event: true,
      category: true,
      period: true,
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "Gallery",
    entityId: gallery.id,
    description: `Created gallery: ${gallery.title}`,
    metadata: {
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
