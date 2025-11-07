import prisma from "@/lib/prisma";
import type {
  CreateArticleCategoryInput,
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
