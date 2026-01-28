/**
 * Gallery Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Gallery-specific operations.
 */

import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/domain/entities/gallery.entity";

// Gallery-specific repository interface
export interface IGalleryRepository {
  /** Find all galleries */
  findAll(): Promise<Gallery[]>;

  /** Find a gallery by ID */
  findById(id: string): Promise<Gallery | null>;

  /** Find galleries with filters and pagination */
  findMany(
    filters?: GalleryFilter,
    pagination?: GalleryPagination,
  ): Promise<{ galleries: Gallery[]; pagination: GalleryPaginationResult }>;

  /** Find galleries by event */
  findByEvent(eventId: string): Promise<Gallery[]>;

  /** Find galleries by category */
  findByCategory(categoryId: string): Promise<Gallery[]>;

  /** Create a gallery */
  create(data: CreateGalleryInput): Promise<Gallery>;

  /** Update an existing gallery */
  update(id: string, data: UpdateGalleryInput): Promise<Gallery>;

  /** Delete a gallery */
  delete(id: string): Promise<void>;

  /** Count galleries with optional filter */
  count(where?: unknown): Promise<number>;
}

// Filter types for Gallery queries
export interface GalleryFilter {
  eventId?: string;
  categoryId?: string;
  periodId?: string;
  search?: string;
}

// Pagination input
export interface GalleryPagination {
  page?: number;
  limit?: number;
}

// Pagination result
export interface GalleryPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
