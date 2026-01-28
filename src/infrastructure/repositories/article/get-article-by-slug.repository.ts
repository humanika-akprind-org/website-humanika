/**
 * Get Article By Slug Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ArticleWithPartialAuthor } from "./get-articles.repository";

export type ArticleWithRelatedArticles = ArticleWithPartialAuthor & {
  relatedArticles?: ArticleWithPartialAuthor[];
};

/**
 * Get article by slug with related articles
 */
export async function getArticleBySlug(
  slug: string,
): Promise<ArticleWithRelatedArticles | null> {
  // Fetch main article by slug
  const article = await prisma.article.findUnique({
    where: { slug },
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
        not: article.id,
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
