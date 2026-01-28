/**
 * Article Repository Prisma - Class-based repository implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This file contains the ArticleRepositoryPrisma class that implements
 * IArticleRepository interface for use with the use case pattern.
 */

import prisma from "@/presentation/lib/prisma";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";
import type {
  CreateArticleInput,
  Article,
  ArticleFilter,
} from "@/domain/entities/article.entity";
import type { Prisma } from "@prisma/client";
import type { Status } from "@/domain/enums";

export class ArticleRepositoryPrisma implements IArticleRepository {
  private prisma = prisma;

  /**
   * Get all articles with optional filters
   */
  async getArticles(filter?: ArticleFilter): Promise<Article[]> {
    const where: Prisma.ArticleWhereInput = {};

    if (filter?.status) {
      where.status = { equals: filter.status as unknown as Status };
    }
    if (filter?.periodId) where.periodId = filter.periodId;
    if (filter?.categoryId) where.categoryId = filter.categoryId;
    if (filter?.authorId) where.authorId = filter.authorId;
    if (filter?.search) {
      where.OR = [
        { title: { contains: filter.search, mode: "insensitive" } },
        { content: { contains: filter.search, mode: "insensitive" } },
      ];
    }

    const articles = await this.prisma.article.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return articles as unknown as Article[];
  }

  /**
   * Get a single article by ID
   */
  async getArticleById(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return article as unknown as Article | null;
  }

  /**
   * Get a single article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { slug },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return article as unknown as Article | null;
  }

  /**
   * Create a new article
   */
  async createArticle(data: CreateArticleInput): Promise<Article> {
    // Generate slug from title
    const slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");

    const articleData: Prisma.ArticleCreateInput = {
      title: data.title,
      slug,
      thumbnail: data.thumbnail,
      content: data.content,
      author: { connect: { id: data.authorId } },
      category: { connect: { id: data.categoryId } },
    };

    // Only include periodId if it's provided and not empty
    if (data.periodId && data.periodId.trim() !== "") {
      articleData.period = { connect: { id: data.periodId } };
    }

    const article = await this.prisma.article.create({
      data: articleData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return article as unknown as Article;
  }

  /**
   * Update an existing article
   */
  async updateArticle(
    id: string,
    data: Partial<CreateArticleInput>,
  ): Promise<Article> {
    const updateData: Prisma.ArticleUpdateInput = {
      title: data.title,
      content: data.content,
      thumbnail: data.thumbnail,
    };

    // Update slug if title changed
    if (data.title) {
      (updateData as Prisma.ArticleUpdateInput).slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    if (data.categoryId) {
      updateData.category = { connect: { id: data.categoryId } };
    }

    if (data.periodId && data.periodId.trim() !== "") {
      updateData.period = { connect: { id: data.periodId } };
    } else if (data.periodId === "") {
      updateData.period = { disconnect: true };
    }

    const article = await this.prisma.article.update({
      where: { id },
      data: updateData,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return article as unknown as Article;
  }

  /**
   * Delete an article
   */
  async deleteArticle(id: string): Promise<void> {
    await this.prisma.article.delete({
      where: { id },
    });
  }

  /**
   * Base repository method - find all articles
   */
  async findAll(): Promise<Article[]> {
    const articles = await this.prisma.article.findMany({
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
      orderBy: { createdAt: "desc" },
    });

    return articles as unknown as Article[];
  }

  /**
   * Base repository method - find by ID
   */
  async findById(id: string): Promise<Article | null> {
    const article = await this.prisma.article.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        category: true,
        period: true,
      },
    });

    return article as unknown as Article | null;
  }
}
