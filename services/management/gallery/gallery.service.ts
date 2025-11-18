import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export type CreateGalleryInput = {
  title: string;
  eventId: string;
  image: string;
};

export type UpdateGalleryInput = {
  title?: string;
  eventId?: string;
  image?: string;
};

export const getGalleries = async (filter: {
  eventId?: string;
  search?: string;
}) => {
  const where: Prisma.GalleryWhereInput = {};

  if (filter.eventId) where.eventId = filter.eventId;
  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { event: { name: { contains: filter.search, mode: "insensitive" } } },
    ];
  }

  const galleries = await prisma.gallery.findMany({
    where,
    include: {
      event: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return galleries;
};

export const getGallery = async (id: string) => {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      event: true,
    },
  });

  return gallery;
};

export const createGallery = async (
  data: CreateGalleryInput,
  user: UserWithId
) => {
  const gallery = await prisma.gallery.create({
    data: {
      title: data.title,
      eventId: data.eventId,
      image: data.image,
    },
    include: {
      event: true,
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
        image: gallery.image,
      },
    },
  });

  return gallery;
};

export const updateGallery = async (
  id: string,
  data: UpdateGalleryInput,
  user: UserWithId
) => {
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
  if (data.image !== undefined) updateData.image = data.image;

  const gallery = await prisma.gallery.update({
    where: { id },
    data: updateData,
    include: {
      event: true,
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
        image: existingGallery.image,
      },
      newData: {
        title: gallery.title,
        eventId: gallery.eventId,
        image: gallery.image,
      },
    },
  });

  return gallery;
};

export const deleteGallery = async (id: string, user: UserWithId) => {
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
        image: existingGallery.image,
      },
      newData: null,
    },
  });
};
