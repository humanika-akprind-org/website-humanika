import prisma from "@/lib/prisma";
import type {
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";
import type { FinanceType } from "@/types/enums";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { User } from "@/types/user";

type UserWithId = Pick<User, "id">;

export const getFinanceCategories = async (filter: {
  type?: FinanceType;
  isActive?: string;
  search?: string;
}) => {
  const where: Prisma.FinanceCategoryWhereInput = {};

  if (filter.type) where.type = { equals: filter.type };
  if (filter.isActive !== null) where.isActive = { equals: filter.isActive === "true" };
  if (filter.search) {
    where.OR = [
      { name: { contains: filter.search, mode: "insensitive" } },
      { description: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  const financeCategories = await prisma.financeCategory.findMany({
    where,
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return financeCategories;
};

export const getFinanceCategory = async (id: string) => {
  const financeCategory = await prisma.financeCategory.findUnique({
    where: { id },
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
  });

  return financeCategory;
};

export const createFinanceCategory = async (
  data: CreateFinanceCategoryInput,
  user: UserWithId
) => {
  const financeCategoryData: Prisma.FinanceCategoryCreateInput = {
    name: data.name,
    description: data.description,
    type: data.type,
  };

  const financeCategory = await prisma.financeCategory.create({
    data: financeCategoryData,
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.CREATE,
    entityType: "FinanceCategory",
    entityId: financeCategory.id,
    description: `Created finance category: ${financeCategory.name}`,
    metadata: {
      newData: {
        name: financeCategory.name,
        description: financeCategory.description,
        type: financeCategory.type,
        isActive: financeCategory.isActive,
      },
    },
  });

  return financeCategory;
};

export const updateFinanceCategory = async (
  id: string,
  data: UpdateFinanceCategoryInput,
  user: UserWithId
) => {
  // Check if finance category exists
  const existingFinanceCategory = await prisma.financeCategory.findUnique({
    where: { id },
  });

  if (!existingFinanceCategory) {
    throw new Error("Finance category not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name !== undefined) updateData.name = data.name;
  if (data.description !== undefined) updateData.description = data.description;
  if (data.type) updateData.type = data.type;
  if (data.isActive !== undefined) updateData.isActive = data.isActive;

  const financeCategory = await prisma.financeCategory.update({
    where: { id },
    data: updateData,
    include: {
      _count: {
        select: {
          finances: true,
        },
      },
    },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "FinanceCategory",
    entityId: financeCategory.id,
    description: `Updated finance category: ${financeCategory.name}`,
    metadata: {
      oldData: {
        name: existingFinanceCategory.name,
        description: existingFinanceCategory.description,
        type: existingFinanceCategory.type,
        isActive: existingFinanceCategory.isActive,
      },
      newData: {
        name: financeCategory.name,
        description: financeCategory.description,
        type: financeCategory.type,
        isActive: financeCategory.isActive,
      },
    },
  });

  return financeCategory;
};

export const deleteFinanceCategory = async (id: string, user: UserWithId) => {
  // Check if finance category exists
  const existingFinanceCategory = await prisma.financeCategory.findUnique({
    where: { id },
  });

  if (!existingFinanceCategory) {
    throw new Error("Finance category not found");
  }

  await prisma.financeCategory.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "FinanceCategory",
    entityId: id,
    description: `Deleted finance category: ${existingFinanceCategory.name}`,
    metadata: {
      oldData: {
        name: existingFinanceCategory.name,
        description: existingFinanceCategory.description,
        type: existingFinanceCategory.type,
        isActive: existingFinanceCategory.isActive,
      },
      newData: null,
    },
  });
};
