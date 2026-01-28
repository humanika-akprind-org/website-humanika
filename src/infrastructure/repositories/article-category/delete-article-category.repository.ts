/**
 * Delete Article Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import { logActivityFromRequest } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { NextRequest } from "next/server";

/**
 * Delete an article category
 * @throws Error if category is being used by any articles
 */
export async function deleteArticleCategory(
  id: string,
  userId: string,
  request: NextRequest,
): Promise<void> {
  const existingCategory = await prisma.articleCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Article category not found");
  }

  // Check if category is being used by any articles
  const articlesCount = await prisma.article.count({
    where: { categoryId: id },
  });

  if (articlesCount > 0) {
    throw new Error("Cannot delete category that is being used by articles");
  }

  await prisma.articleCategory.delete({
    where: { id },
  });

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.DELETE,
    entityType: "ArticleCategory",
    entityId: id,
    description: `Deleted article category: ${existingCategory.name}`,
    metadata: {
      oldData: {
        name: existingCategory.name,
      },
      newData: null,
    },
  });
}
