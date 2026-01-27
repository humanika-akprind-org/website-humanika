/**
 * Create Article Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateArticleInput } from "@/domain/entities/article.entity";
import type { Prisma } from "@prisma/client";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { ArticleWithPartialAuthor } from "./get-articles.repository";

/**
 * Create a new article
 */
export async function createArticle(
  data: CreateArticleInput,
  user: { id: string },
): Promise<ArticleWithPartialAuthor> {
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

  return article;
}
