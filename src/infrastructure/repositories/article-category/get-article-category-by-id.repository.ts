/**
 * Get Article Category By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { ArticleCategory } from "@/domain/value-objects/article-category";

/**
 * Get a single article category by its ID
 */
export async function getArticleCategoryById(
  id: string,
): Promise<ArticleCategory | null> {
  return await prisma.articleCategory.findUnique({
    where: { id },
  });
}
