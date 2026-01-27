import prisma from "@/presentation/lib/prisma";
import type { Prisma } from "@prisma/client";
import type {
  CreateArticleInput,
  Article,
  ArticleFilter,
} from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Article Repository Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements IArticleRepository using Prisma ORM
 */
export class ArticleRepositoryPrisma implements IArticleRepository {
  /**
   * Get all articles with optional filters
   */
  async getArticles(filter?: ArticleFilter): Promise<Article[]> {
    const where: Prisma.ArticleWhereInput = {};

    if (filter?.status) {
      where.status = { equals: filter.status as any };
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

    const articles = await prisma.article.findMany({
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
    const article = await prisma.article.findUnique({
      where: { id },
      include: {
        author: true,
        category: true,
        period: true,
      },
    });

    if (!article) return null;
    return article as unknown as Article;
  }

  /**
   * Get a single article by slug
   */
  async getArticleBySlug(slug: string): Promise<Article | null> {
    const article = await prisma.article.findUnique({
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

    if (!article) return null;
    return article as unknown as Article;
  }

  /**
   * Create a new article
   */
  async createArticle(
    data: CreateArticleInput,
    user: { id: string },
  ): Promise<Article> {
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

    const article = await prisma.article.create({
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

    // Log activity
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Article",
      entityId: article.id,
      description: `Created article: ${article.title}`,
      metadata: {
        oldData: null,
        newData: {
          title: article.title,
          slug: article.slug,
          categoryId: article.categoryId,
          authorId: article.authorId,
        },
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
    const articleData: Prisma.ArticleUpdateInput = {
      title: data.title,
      thumbnail: data.thumbnail,
      content: data.content,
      category: data.categoryId
        ? { connect: { id: data.categoryId } }
        : undefined,
      period: data.periodId ? { connect: { id: data.periodId } } : undefined,
    };

    // If title is being updated, regenerate slug
    if (data.title) {
      articleData.slug = data.title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");
    }

    const article = await prisma.article.update({
      where: { id },
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

    // Log activity
    await logActivity({
      userId: "", // TODO: Get from context
      activityType: ActivityType.UPDATE,
      entityType: "Article",
      entityId: article.id,
      description: `Updated article: ${article.title}`,
      metadata: {
        oldData: null,
        newData: {
          title: article.title,
          slug: article.slug,
        },
      },
    });

    return article as unknown as Article;
  }

  /**
   * Delete an article
   */
  async deleteArticle(id: string): Promise<void> {
    // Log activity before deletion
    const article = await prisma.article.findUnique({
      where: { id },
      select: { title: true },
    });

    if (article) {
      await logActivity({
        userId: "", // TODO: Get from context
        activityType: ActivityType.DELETE,
        entityType: "Article",
        entityId: id,
        description: `Deleted article: ${article.title}`,
        metadata: {
          oldData: { title: article.title },
          newData: null,
        },
      });
    }

    await prisma.article.delete({
      where: { id },
    });
  }
}
