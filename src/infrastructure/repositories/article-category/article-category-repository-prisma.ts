/**
 * Article Category Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IArticleCategoryRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import prisma from "@/presentation/lib/prisma";
import type {
  IArticleCategoryRepository,
  ArticleCategoryFilter,
} from "@/application/interface/article-category.repository.interface";
import type { BaseFilter } from "@/application/interface/base.repository.interface";
import type {
  ArticleCategory,
  CreateArticleCategoryInput,
} from "@/domain/value-objects/article-category";

/**
 * Article Category Repository Prisma Implementation
 *
 * This class implements the IArticleCategoryRepository interface
 * for Clean Architecture compliance.
 */
export class ArticleCategoryRepositoryPrisma implements IArticleCategoryRepository {
  private prisma = prisma;

  /**
   * Get all article categories
   */
  async findAll(): Promise<ArticleCategory[]> {
    const categories = await this.prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
    });

    return categories as unknown as ArticleCategory[];
  }

  /**
   * Get all article categories with optional filtering and pagination
   */
  async findMany(
    filters?: ArticleCategoryFilter,
    pagination?: { page?: number; limit?: number },
  ): Promise<{
    records: ArticleCategory[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    // Determine if we need to include article count
    const includeCount = filters?.withCount;

    const categories = await this.prisma.articleCategory.findMany({
      orderBy: { name: "asc" },
      ...(includeCount && {
        include: {
          _count: {
            select: {
              articles: {
                where: {
                  status: "PUBLISH",
                },
              },
            },
          },
        },
      }),
    });

    // Get total count for pagination
    const total = categories.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated categories
    const paginatedRecords = categories.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as ArticleCategory[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single article category by ID
   */
  async findById(id: string): Promise<ArticleCategory | null> {
    const category = await this.prisma.articleCategory.findUnique({
      where: { id },
    });

    return category as unknown as ArticleCategory | null;
  }

  /**
   * Create a new article category
   */
  async create(
    data: CreateArticleCategoryInput,
    _userId: string,
  ): Promise<ArticleCategory> {
    const category = await this.prisma.articleCategory.create({
      data: {
        name: data.name.trim(),
        description: data.description?.trim() || null,
      },
    });

    return category as unknown as ArticleCategory;
  }

  /**
   * Update an existing article category
   */
  async update(
    id: string,
    data: Partial<CreateArticleCategoryInput>,
  ): Promise<ArticleCategory> {
    const updateData: Record<string, unknown> = {};

    if (data.name && data.name.trim()) {
      updateData.name = data.name.trim();
    }

    if (data.description !== undefined) {
      updateData.description = data.description?.trim() || null;
    }

    const category = await this.prisma.articleCategory.update({
      where: { id },
      data: updateData,
    });

    return category as unknown as ArticleCategory;
  }

  /**
   * Delete an article category
   */
  async delete(id: string): Promise<void> {
    await this.prisma.articleCategory.delete({
      where: { id },
    });
  }

  /**
   * Count article categories with optional filter
   */
  async count(_where?: BaseFilter): Promise<number> {
    const categories = await this.prisma.articleCategory.findMany();
    return categories.length;
  }
}
