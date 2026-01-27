/**
 * Get Article By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ArticleWithRelatedArticles } from "./get-article-by-slug.repository";

/**
 * Get article by ID with related articles
 */
export async function getArticleById(
  id: string,
): Promise<ArticleWithRelatedArticles | null> {
  // Fetch main article
  const article = await prisma.article.findUnique({
    where: { id },
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

  if (!article) {
    return null;
  }

  // Fetch related articles by same category excluding current article
  const relatedArticles = await prisma.article.findMany({
    where: {
      categoryId: article.categoryId,
      id: {
        not: id,
      },
      status: "PUBLISH",
    },
    take: 4, // Limit to 4 related articles
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
    orderBy: {
      createdAt: "desc",
    },
  });

  return {
    ...article,
    relatedArticles,
  };
}
