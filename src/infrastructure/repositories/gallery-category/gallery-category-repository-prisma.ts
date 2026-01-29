/**
 * Gallery Category Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IGalleryCategoryRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IGalleryCategoryRepository,
  GalleryCategoryFilter,
  GalleryCategoryPagination,
  GalleryCategoryPaginationResult,
  GalleryCategoryStats,
} from "@/application/interface/gallery-category.repository.interface";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";
import {
  getGalleryCategories,
  getGalleryCategory,
  createGalleryCategory,
  updateGalleryCategory,
  deleteGalleryCategory,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Gallery Category Repository Prisma Implementation
 *
 * This class implements the IGalleryCategoryRepository interface
 * for Clean Architecture compliance.
 */
export class GalleryCategoryRepositoryPrisma implements IGalleryCategoryRepository {
  /**
   * Get all gallery categories
   */
  async findAll(): Promise<GalleryCategory[]> {
    return (await getGalleryCategories()) as GalleryCategory[];
  }

  /**
   * Get all gallery categories with optional filtering and pagination
   */
  async findMany(
    filter?: GalleryCategoryFilter,
    pagination?: GalleryCategoryPagination,
  ): Promise<{
    records: GalleryCategory[];
    pagination: GalleryCategoryPaginationResult;
  }> {
    let records = await getGalleryCategories();

    // Apply filter if provided
    if (filter?.search) {
      const searchTerm = filter.search.toLowerCase();
      records = records.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchTerm)),
      );
    }

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated gallery categories
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as GalleryCategory[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single gallery category by ID
   */
  async findById(id: string): Promise<GalleryCategory | null> {
    return (await getGalleryCategory(id)) as GalleryCategory | null;
  }

  /**
   * Find gallery category by name (for duplicate checking)
   */
  async findByName(name: string): Promise<GalleryCategory | null> {
    const categories = await getGalleryCategories();
    const category = categories.find((c) => c.name === name);
    return (category as GalleryCategory | undefined) || null;
  }

  /**
   * Create a new gallery category
   */
  async create(
    data: CreateGalleryCategoryInput,
    userId: string,
  ): Promise<GalleryCategory> {
    const user: UserWithId = { id: userId };
    return await createGalleryCategory(data, user);
  }

  /**
   * Update an existing gallery category
   */
  async update(
    id: string,
    data: UpdateGalleryCategoryInput,
    userId: string,
  ): Promise<GalleryCategory> {
    const user: UserWithId = { id: userId };
    return await updateGalleryCategory(id, data, user);
  }

  /**
   * Delete a gallery category
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteGalleryCategory(id, user);
  }

  /**
   * Count gallery categories with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const categories = await getGalleryCategories();

    if (!where) {
      return categories.length;
    }

    // Apply filter if provided
    let filteredCategories = categories;

    if (where.search) {
      const searchTerm = (where.search as string).toLowerCase();
      filteredCategories = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchTerm)),
      );
    }

    return filteredCategories.length;
  }

  /**
   * Get aggregated gallery category statistics
   */
  async getStats(
    where?: Record<string, unknown>,
  ): Promise<GalleryCategoryStats> {
    const categories = await getGalleryCategories();

    let filteredCategories = categories;

    if (where?.search) {
      const searchTerm = (where.search as string).toLowerCase();
      filteredCategories = categories.filter(
        (cat) =>
          cat.name.toLowerCase().includes(searchTerm) ||
          (cat.description &&
            cat.description.toLowerCase().includes(searchTerm)),
      );
    }

    return {
      total: filteredCategories.length,
    };
  }
}
