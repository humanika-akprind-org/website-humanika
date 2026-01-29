/**
 * Get Articles Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Prisma } from "@prisma/client";
import type { Status } from "@prisma/client";

export type ArticleWithPartialAuthor = Prisma.ArticleGetPayload<{
  include: {
    author: {
      select: {
        id: true;
        name: true;
        email: true;
      };
    };
    category: true;
    period: true;
  };
}>;

export interface ArticleFilter {
  status?: Status;
  periodId?: string;
  categoryId?: string;
  authorId?: string;
  search?: string;
}

/**
 * Get all articles with optional filters
 */
export async function getArticles(
  filter?: ArticleFilter,
): Promise<ArticleWithPartialAuthor[]> {
  const where: Prisma.ArticleWhereInput = {};

  if (filter?.status) {
    where.status = { equals: filter.status };
  }
  if (filter?.periodId) where.periodId = filter.periodId;
  if (filter?.categoryId) where.categoryId = filter.categoryId;
  if (filter?.authorId) where.authorId = filter.authorId;
  if (filter?.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { content: { contains: filter.search, mode: "insensitive" } },
    ];
  }

  return await prisma.article.findMany({
    where,
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
    orderBy: { createdAt: "desc" },
  });
}
