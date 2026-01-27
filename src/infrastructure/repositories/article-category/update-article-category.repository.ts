/**
 * Update Article Category Repository - Write operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { UpdateArticleCategoryInput } from "@/domain/value-objects/article-category";
import { logActivityFromRequest } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";
import type { NextRequest } from "next/server";
import type { ArticleCategory } from "@/domain/value-objects/article-category";

/**
 * Update an existing article category
 */
export async function updateArticleCategory(
  id: string,
  data: UpdateArticleCategoryInput,
  userId: string,
  request: NextRequest,
): Promise<ArticleCategory> {
  const existingCategory = await prisma.articleCategory.findUnique({
    where: { id },
  });

  if (!existingCategory) {
    throw new Error("Article category not found");
  }

  const updateData: Record<string, unknown> = {};

  if (data.name && data.name.trim()) {
    updateData.name = data.name.trim();
  }

  if (data.description !== undefined) {
    updateData.description = data.description?.trim() || null;
  }

  const category = await prisma.articleCategory.update({
    where: { id },
    data: updateData,
  });

  // Log activity
  await logActivityFromRequest(request, {
    userId,
    activityType: ActivityType.UPDATE,
    entityType: "ArticleCategory",
    entityId: category.id,
    description: `Updated article category: ${category.name}`,
    metadata: {
      oldData: {
        name: existingCategory.name,
        description: existingCategory.description,
      },
      newData: {
        name: category.name,
        description: category.description,
      },
    },
  });

  return category;
}
