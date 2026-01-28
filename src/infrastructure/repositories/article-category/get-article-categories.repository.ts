/**
 * Get Article Categories Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ArticleCategory } from "@/domain/value-objects/article-category";

/**
 * Get all article categories sorted alphabetically by name
 */
export async function getArticleCategories(): Promise<ArticleCategory[]> {
  return await prisma.articleCategory.findMany({
    orderBy: { name: "asc" },
  });
}

/**
 * Get all article categories with count of published articles, sorted by name
 */
export async function getArticleCategoriesWithCount(): Promise<
  ArticleCategory[]
> {
  return await prisma.articleCategory.findMany({
    orderBy: { name: "asc" },
    include: {
      _count: {
        select: {
          articles: {
            where: {
              status: "PUBLISH",
            },
          },
        },
      },
    },
  });
}
