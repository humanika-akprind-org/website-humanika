import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/domain/entities/gallery.entity";
import type { GalleryFilter } from "@/domain/entities/gallery.entity";

/**
 * Gallery Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Gallery-specific operations.
 */
export interface IGalleryRepository {
  /** Find all galleries */
  findAll(): Promise<Gallery[]>;

  /** Find a gallery by ID */
  findById(id: string): Promise<Gallery | null>;

  /** Find galleries with filters and pagination */
  findMany(
    filters?: GalleryFilter,
    pagination?: BasePagination,
  ): Promise<{ records: Gallery[]; pagination: BasePaginationResult }>;

  /** Find galleries by event */
  findByEvent(eventId: string): Promise<Gallery[]>;

  /** Find galleries by category */
  findByCategory(categoryId: string): Promise<Gallery[]>;

  /** Create a new gallery */
  create(data: CreateGalleryInput): Promise<Gallery>;

  /** Update an existing gallery */
  update(id: string, data: UpdateGalleryInput): Promise<Gallery>;

  /** Delete a gallery */
  delete(id: string): Promise<void>;

  /** Count galleries with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { GalleryFilter };

// Re-export base types with Gallery-specific names for convenience
export type { BasePagination as GalleryPagination };
export type { BasePaginationResult as GalleryPaginationResult };
export type { BaseStats as GalleryStats };
