/**
 * Article Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IArticleRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type { IArticleRepository } from "@/application/interface/article.repository.interface";
import type {
  Article,
  ArticleFilter,
  CreateArticleInput,
} from "@/domain/entities/article.entity";
import {
  getArticles,
  getArticleById,
  getArticleBySlug,
  createArticle,
  updateArticle,
  deleteArticle,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Article Repository Prisma Implementation
 *
 * This class implements the IArticleRepository interface
 * for Clean Architecture compliance.
 */
export class ArticleRepositoryPrisma implements IArticleRepository {
  /**
   * Get all articles
   */
  async findAll(): Promise<Article[]> {
    return (await getArticles()) as Article[];
  }

  /**
   * Get all articles with optional filtering and pagination
   */
  async findMany(
    filter?: ArticleFilter,
    pagination?: { page?: number; limit?: number },
  ): Promise<{
    records: Article[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    const records = await getArticles(filter);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated articles
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as Article[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single article by ID
   */
  async findById(id: string): Promise<Article | null> {
    return (await getArticleById(id)) as Article | null;
  }

  /**
   * Get a single article by slug
   */
  async findBySlug(slug: string): Promise<Article | null> {
    return (await getArticleBySlug(slug)) as Article | null;
  }

  /**
   * Create a new article
   */
  async create(
    data: CreateArticleInput,
    user: { id: string },
  ): Promise<Article> {
    return await createArticle(data, user);
  }

  /**
   * Update an existing article
   */
  async update(
    id: string,
    data: Partial<CreateArticleInput>,
  ): Promise<Article> {
    return await updateArticle(id, data, { id: "" });
  }

  /**
   * Delete an article
   */
  async delete(id: string): Promise<void> {
    await deleteArticle(id, { id: "" });
  }

  /**
   * Count articles with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const articles = await getArticles({
      status: where?.status as import("@/domain/enums").Status,
      periodId: where?.periodId as string,
      categoryId: where?.categoryId as string,
      authorId: where?.authorId as string,
    });
    return articles.length;
  }

  /**
   * Get aggregated article statistics
   */
  async getStats(
    where?: Record<string, unknown>,
  ): Promise<{ total: number; [key: string]: number | string | unknown }> {
    const articles = await getArticles({
      status: where?.status as import("@/domain/enums").Status,
      periodId: where?.periodId as string,
      categoryId: where?.categoryId as string,
    });

    // Basic stats - can be extended with more aggregations
    const stats: {
      total: number;
      published: number;
      draft: number;
      [key: string]: number | string | unknown;
    } = {
      total: articles.length,
      published: 0,
      draft: 0,
    };

    // Count by status
    for (const article of articles) {
      if (article.status === "PUBLISH") {
        stats.published++;
      } else if (article.status === "DRAFT") {
        stats.draft++;
      }
    }

    return stats;
  }

  // Aliases for backward compatibility with existing use cases
  async getArticleById(id: string): Promise<Article | null> {
    return this.findById(id);
  }

  async getArticleBySlug(slug: string): Promise<Article | null> {
    return this.findBySlug(slug);
  }

  async getArticles(filter?: ArticleFilter): Promise<Article[]> {
    const result = await this.findMany(filter);
    return result.records;
  }

  async createArticle(
    data: CreateArticleInput,
    user: { id: string },
  ): Promise<Article> {
    return this.create(data, user);
  }

  async updateArticle(
    id: string,
    data: Partial<CreateArticleInput>,
  ): Promise<Article> {
    return this.update(id, data);
  }

  async deleteArticle(id: string): Promise<void> {
    return this.delete(id);
  }
}
