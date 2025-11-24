import prisma from "@/lib/prisma";
import type {
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/types/event-category";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getEventCategories = async () => {
  const categories = await prisma.eventCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
};

export const getEventCategory = async (id: string) => {
  const category = await prisma.eventCategory.findUnique({
    where: { id },
  });

  return category;
};

export const createEventCategory = async (
  data: CreateEventCategoryInput,
  user: UserWithId
) => {
  const category = await prisma.eventCategory.create({
    data,
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "EventCategory",
    entityId: category.id,
    description: `Created event category: ${category.name}`,
    metadata: {
      newData: {
        name: category.name,
        description: category.description,
      },
    },
  });

  return category;
};

export const updateEventCategory = async (
  id: string,
  data: UpdateEventCategoryInput,
  user: UserWithId
) => {
  // Get existing category for logging
  const existingCategory = await prisma.eventCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Event category not found");
  }

  const category = await prisma.eventCategory.update({
    where: { id },
    data,
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

  return category;
};

export const deleteEventCategory = async (id: string, user: UserWithId) => {
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
};
