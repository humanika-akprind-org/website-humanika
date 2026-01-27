/**
 * Get Galleries Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 */

import prisma from "@/presentation/lib/prisma";
import type { Prisma } from "@prisma/client";

export type GetGalleriesFilter = {
  eventId?: string;
  categoryId?: string;
  search?: string;
};

/**
 * Get all galleries with optional filters
 */
export async function getGalleries(filter: GetGalleriesFilter) {
  const where: Prisma.GalleryWhereInput = {};

  if (filter.eventId) where.eventId = filter.eventId;
  if (filter.categoryId) where.categoryId = filter.categoryId;
  if (filter.search) {
    where.OR = [
      { title: { contains: filter.search, mode: "insensitive" } },
      { event: { name: { contains: filter.search, mode: "insensitive" } } },
    ];
  }

  const galleries = await prisma.gallery.findMany({
    where,
    include: {
      event: true,
      category: true,
      period: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return galleries;
}
