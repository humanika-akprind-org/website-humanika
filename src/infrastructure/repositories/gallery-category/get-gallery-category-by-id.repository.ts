/**
 * Get Gallery Category By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single gallery category by ID
 */
export async function getGalleryCategory(id: string) {
  const category = await prisma.galleryCategory.findUnique({
    where: { id },
  });

  return category;
}
