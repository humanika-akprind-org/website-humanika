/**
 * Get Gallery By ID Repository - Read operation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";

/**
 * Get a single gallery by ID
 */
export async function getGallery(id: string) {
  const gallery = await prisma.gallery.findUnique({
    where: { id },
    include: {
      event: true,
      category: true,
      period: true,
    },
  });

  return gallery;
}
