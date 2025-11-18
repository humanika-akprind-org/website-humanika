import prisma from "@/lib/prisma";
import type {
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput,
  ArticleCategory,
} from "@/types/article-category";
import { logActivityFromRequest } from "@/lib/activity-log";
import { ActivityType } from "@/types/enums";
import type { NextRequest } from "next/server";

export async function getArticleCategories(): Promise<ArticleCategory[]> {
  return await prisma.articleCategory.findMany({
    orderBy: { name: "asc" },
  });
}

export async function getArticleCategoryById(
  id: string
): Promise<ArticleCategory | null> {
  return await prisma.articleCategory.findUnique({
    where: { id },
  });
}

export async function createArticleCategory(
  data: CreateArticleCategoryInput,
  userId: string,
  request: NextRequest
): Promise<ArticleCategory> {
  const category = await prisma.articleCategory.create({
    data: {
      name: data.name.trim(),
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

export async function updateArticleCategory(
  id: string,
  data: UpdateArticleCategoryInput,
  userId: string,
  request: NextRequest
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
      },
      newData: {
        name: category.name,
      },
    },
  });

  return category;
}

export async function deleteArticleCategory(
  id: string,
  userId: string,
  request: NextRequest
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
