/**
 * Update Article Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateArticleInput } from "@/domain/entities/article.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { ArticleWithPartialAuthor } from "./get-articles.repository";

/**
 * Update an existing article
 */
export async function updateArticle(
  id: string,
  data: UpdateArticleInput,
  user: { id: string },
): Promise<ArticleWithPartialAuthor> {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });

  if (!existingArticle) {
    throw new Error("Article not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.title) {
    updateData.title = data.title;
    updateData.slug = data.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "");
  }
  if (data.thumbnail !== undefined) updateData.thumbnail = data.thumbnail;
  if (data.content !== undefined) updateData.content = data.content;
  if (data.authorId) updateData.authorId = data.authorId;
  if (data.categoryId) updateData.categoryId = data.categoryId;
  if (data.periodId !== undefined && data.periodId.trim() !== "") {
    updateData.periodId = data.periodId;
  } else if (data.periodId === "") {
    updateData.periodId = null;
  }
  if (data.status) updateData.status = data.status;

  const article = await prisma.article.update({
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

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.UPDATE,
    entityType: "Article",
    entityId: article.id,
    description: `Updated article: ${article.title}`,
    metadata: {
      oldData: {
        title: existingArticle.title,
        slug: existingArticle.slug,
        categoryId: existingArticle.categoryId,
        authorId: existingArticle.authorId,
      },
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
