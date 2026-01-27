/**
 * Delete Article Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

/**
 * Delete an article
 */
export async function deleteArticle(
  id: string,
  user: { id: string },
): Promise<void> {
  const existingArticle = await prisma.article.findUnique({
    where: { id },
  });

  if (!existingArticle) {
    throw new Error("Article not found");
  }

  await prisma.article.delete({
    where: { id },
  });

  // Log activity
  await logActivity({
    userId: user.id,
    activityType: ActivityType.DELETE,
    entityType: "Article",
    entityId: id,
    description: `Deleted article: ${existingArticle.title}`,
    metadata: {
      oldData: {
        title: existingArticle.title,
        slug: existingArticle.slug,
        categoryId: existingArticle.categoryId,
        authorId: existingArticle.authorId,
      },
      newData: null,
    },
  });
}
