/**
 * Create Article Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { CreateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { logActivityFromRequest } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { NextRequest } from "next/server";
import type { ArticleCategory } from "@/domain/value-objects/article-category";

/**
 * Create a new article category
 */
export async function createArticleCategory(
  data: CreateArticleCategoryInput,
  userId: string,
  request: NextRequest,
): Promise<ArticleCategory> {
  const category = await prisma.articleCategory.create({
    data: {
      name: data.name.trim(),
      description: data.description?.trim() || null,
    },
  });

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.CREATE,
    entityType: "ArticleCategory",
    entityId: category.id,
    description: `Created article category: ${category.name}`,
    metadata: {
      newData: {
        name: category.name,
      },
    },
  });

  return category;
}
