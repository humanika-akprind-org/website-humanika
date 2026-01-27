/**
 * Get Gallery Categories Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get all gallery categories sorted alphabetically by name
 */
export async function getGalleryCategories() {
  const categories = await prisma.galleryCategory.findMany({
    orderBy: { name: "asc" },
  });

  return categories;
}
