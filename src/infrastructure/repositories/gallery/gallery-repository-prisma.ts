/**
 * Gallery Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IGalleryRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IGalleryRepository,
  GalleryFilter,
  GalleryPagination,
  GalleryPaginationResult,
  GalleryStats,
} from "@/application/interface/gallery.repository.interface";
import type {
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/domain/entities/gallery.entity";
import type { Gallery } from "@/domain/entities/gallery.entity";
import {
  getGalleries as getAllGalleries,
  getGalleryById,
  createGallery,
  updateGallery,
  deleteGallery,
} from "./index";
import type { GetGalleriesFilter } from "./get-galleries.repository";

// Type alias for user context
type UserWithId = { id: string };

// Helper to convert GalleryFilter to GetGalleriesFilter
function toGetGalleriesFilter(filter?: GalleryFilter): GetGalleriesFilter {
  if (!filter) return {} as GetGalleriesFilter;
  return {
    eventId: filter.eventId,
    categoryId: filter.categoryId,
    search: filter.search,
  } as GetGalleriesFilter;
}

/**
 * Gallery Repository Prisma Implementation
 *
 * This class implements the IGalleryRepository interface
 * for Clean Architecture compliance.
 */
export class GalleryRepositoryPrisma implements IGalleryRepository {
  /**
   * Get all galleries
   */
  async findAll(): Promise<Gallery[]> {
    return (await getAllGalleries({})) as unknown as Gallery[];
  }

  /**
   * Get all galleries with optional filtering and pagination
   */
  async findMany(
    filter?: GalleryFilter,
    pagination?: GalleryPagination,
  ): Promise<{ records: Gallery[]; pagination: GalleryPaginationResult }> {
    const records = await getAllGalleries(toGetGalleriesFilter(filter));

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated galleries
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as unknown as Gallery[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single gallery by ID
   */
  async findById(id: string): Promise<Gallery | null> {
    return (await getGalleryById(id)) as Gallery | null;
  }

  /**
   * Find galleries by event ID
   */
  async findByEvent(eventId: string): Promise<Gallery[]> {
    const galleries = await getAllGalleries({ eventId });
    return galleries as unknown as Gallery[];
  }

  /**
   * Find galleries by category ID
   */
  async findByCategory(categoryId: string): Promise<Gallery[]> {
    const galleries = await getAllGalleries({ categoryId });
    return galleries as unknown as Gallery[];
  }

  /**
   * Create a new gallery
   */
  async create(data: CreateGalleryInput, userId: string): Promise<Gallery> {
    const user: UserWithId = { id: userId };
    return (await createGallery(data, user)) as unknown as Gallery;
  }

  /**
   * Update an existing gallery
   */
  async update(
    id: string,
    data: UpdateGalleryInput,
    userId: string,
  ): Promise<Gallery> {
    const user: UserWithId = { id: userId };
    return (await updateGallery(id, data, user)) as unknown as Gallery;
  }

  /**
   * Delete a gallery
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteGallery(id, user);
  }

  /**
   * Count galleries with optional filter
   */
  async count(where?: GalleryFilter): Promise<number> {
    const galleries = await getAllGalleries(toGetGalleriesFilter(where));
    return galleries.length;
  }

  /**
   * Get aggregated gallery statistics
   */
  async getStats(where?: GalleryFilter): Promise<GalleryStats> {
    const galleries = await getAllGalleries(toGetGalleriesFilter(where));

    // Calculate stats
    const byCategory: Record<string, number> = {};
    const byEvent: Record<string, number> = {};

    // Count by category
    for (const gallery of galleries) {
      if (gallery.categoryId) {
        byCategory[gallery.categoryId] =
          (byCategory[gallery.categoryId] || 0) + 1;
      }
      if (gallery.eventId) {
        byEvent[gallery.eventId] = (byEvent[gallery.eventId] || 0) + 1;
      }
    }

    return {
      total: galleries.length,
      byCategory,
      byEvent,
    };
  }
}
