import prisma from "@/lib/prisma";
import type {
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getGalleryCategories = async () => {
  const categories = await prisma.galleryCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
};

export const getGalleryCategory = async (id: string) => {
  const category = await prisma.galleryCategory.findUnique({
    where: { id },
  });

  return category;
};

export const createGalleryCategory = async (
  data: CreateGalleryCategoryInput,
  user: UserWithId
) => {
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
};

export const updateGalleryCategory = async (
  id: string,
  data: UpdateGalleryCategoryInput,
  user: UserWithId
) => {
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
};

export const deleteGalleryCategory = async (id: string, user: UserWithId) => {
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
};
