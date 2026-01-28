/**
 * Finance Category Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IFinanceCategoryRepository interface
 * using Prisma ORM for database operations.
 */

import type { IFinanceCategoryRepository } from "@/application/interface/finance-category.repository.interface";
import type {
  CreateFinanceCategoryInput,
  FinanceCategory,
  FinanceCategoryFilter,
} from "@/domain/value-objects/finance-category";
import type { Prisma } from "@prisma/client";
import prisma from "@/presentation/lib/prisma";

/**
 * Transform Prisma result to FinanceCategory type
 */
function transformToFinanceCategory(
  category: Prisma.FinanceCategoryGetPayload<{
    include: { _count: { select: { finances: true } } };
  }>,
): FinanceCategory {
  return {
    id: category.id,
    name: category.name,
    description: category.description ?? undefined,
    type: category.type as FinanceCategory["type"],
    createdAt: category.createdAt,
    updatedAt: category.updatedAt,
    _count: category._count,
  };
}

/**
 * Finance Category Repository Prisma Implementation
 */
export class FinanceCategoryRepositoryPrisma implements IFinanceCategoryRepository {
  /**
   * Get all finance categories with optional filters
   */
  async getFinanceCategories(
    filter?: FinanceCategoryFilter,
  ): Promise<FinanceCategory[]> {
    const where: Prisma.FinanceCategoryWhereInput = {};

    if (filter?.type) where.type = { equals: filter.type };
    if (filter?.search) {
      where.OR = [
        { name: { contains: filter.search, mode: "insensitive" } },
        { description: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const categories = await prisma.financeCategory.findMany({
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

    return categories.map(transformToFinanceCategory);
  }

  /**
   * Get a single finance category by ID
   */
  async getFinanceCategoryById(id: string): Promise<FinanceCategory | null> {
    const category = await prisma.financeCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
    });

    if (!category) return null;
    return transformToFinanceCategory(category);
  }

  /**
   * Create a new finance category
   */
  async createFinanceCategory(
    data: CreateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory> {
    const category = await prisma.financeCategory.create({
      data: {
        name: data.name,
        description: data.description,
        type: data.type,
      },
      include: {
        _count: {
          select: {
            finances: true,
          },
        },
      },
    });

    // Log activity - import here to avoid circular dependency
    const { logActivity } = await import("@/presentation/lib/activity-log");
    const { ActivityType } = await import("@/domain/enums");

    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "FinanceCategory",
      entityId: category.id,
      description: `Created finance category: ${category.name}`,
      metadata: {
        newData: {
          name: category.name,
          description: category.description,
          type: category.type,
        },
      },
    });

    return transformToFinanceCategory(category);
  }

  /**
   * Update an existing finance category
   */
  async updateFinanceCategory(
    id: string,
    data: Partial<CreateFinanceCategoryInput>,
    user: { id: string },
  ): Promise<FinanceCategory> {
    // Check if finance category exists
    const existingFinanceCategory = await prisma.financeCategory.findUnique({
      where: { id },
    });

    if (!existingFinanceCategory) {
      throw new Error("Finance category not found");
    }

    const updateData: Prisma.FinanceCategoryUpdateInput = {};

    if (data.name !== undefined) updateData.name = data.name;
    if (data.description !== undefined) {
      updateData.description = data.description;
    }
    if (data.type) updateData.type = data.type;

    const category = await prisma.financeCategory.update({
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

    // Log activity - import here to avoid circular dependency
    const { logActivity } = await import("@/presentation/lib/activity-log");
    const { ActivityType } = await import("@/domain/enums");

    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "FinanceCategory",
      entityId: category.id,
      description: `Updated finance category: ${category.name}`,
      metadata: {
        oldData: {
          name: existingFinanceCategory.name,
          description: existingFinanceCategory.description,
          type: existingFinanceCategory.type,
        },
        newData: {
          name: category.name,
          description: category.description,
          type: category.type,
        },
      },
    });

    return transformToFinanceCategory(category);
  }

  /**
   * Delete a finance category
   */
  async deleteFinanceCategory(id: string, user: { id: string }): Promise<void> {
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

    // Log activity - import here to avoid circular dependency
    const { logActivity } = await import("@/presentation/lib/activity-log");
    const { ActivityType } = await import("@/domain/enums");

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
        },
        newData: null,
      },
    });
  }
}
