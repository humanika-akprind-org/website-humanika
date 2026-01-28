/**
 * Article Category Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the ArticleCategoryRepositoryPrisma class that implements
 * IArticleCategoryRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";
import type {
  ArticleCategory,
  CreateArticleCategoryInput,
} from "@/domain/value-objects/article-category";

export class ArticleCategoryRepositoryPrisma implements IArticleCategoryRepository {
  private prisma = prisma;

  /**
   * Get all article categories
   */
  async getArticleCategories(): Promise<ArticleCategory[]> {
    const categories = await this.prisma.articleCategory.findMany({
      orderBy: { createdAt: "desc" },
    });

    return categories as unknown as ArticleCategory[];
  }

  /**
   * Get all article categories with article count
   */
  async getArticleCategoriesWithCount(): Promise<ArticleCategory[]> {
    const categories = await this.prisma.articleCategory.findMany({
      include: {
        _count: {
          select: { articles: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    return categories as unknown as ArticleCategory[];
  }

  /**
   * Get a single category by ID
   */
  async getArticleCategoryById(id: string): Promise<ArticleCategory | null> {
    const category = await this.prisma.articleCategory.findUnique({
      where: { id },
    });

    return category as unknown as ArticleCategory | null;
  }

  /**
   * Create a new article category
   */
  async createArticleCategory(
    data: CreateArticleCategoryInput,
    _userId: string,
  ): Promise<ArticleCategory> {
    const category = await this.prisma.articleCategory.create({
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return category as unknown as ArticleCategory;
  }

  /**
   * Update an existing category
   */
  async updateCategory(
    id: string,
    data: Partial<CreateArticleCategoryInput>,
  ): Promise<ArticleCategory> {
    const category = await this.prisma.articleCategory.update({
      where: { id },
      data: {
        name: data.name,
        description: data.description,
      },
    });

    return category as unknown as ArticleCategory;
  }

  /**
   * Delete a category
   */
  async deleteCategory(id: string): Promise<void> {
    await this.prisma.articleCategory.delete({
      where: { id },
    });
  }
}
