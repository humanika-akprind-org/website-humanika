import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";

/**
 * Gallery Category Filter
 */
export interface GalleryCategoryFilter extends BaseFilter {
  search?: string;
}

// Define GalleryCategory-specific type aliases
export type GalleryCategoryPagination = BasePagination;
export type GalleryCategoryPaginationResult = BasePaginationResult;
export type GalleryCategoryStats = BaseStats;

/**
 * Gallery Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines GalleryCategory-specific operations.
 */
export interface IGalleryCategoryRepository {
  /** Find all gallery categories */
  findAll(): Promise<GalleryCategory[]>;

  /** Find gallery categories with pagination */
  findMany(
    filters?: GalleryCategoryFilter,
    pagination?: GalleryCategoryPagination,
  ): Promise<{
    records: GalleryCategory[];
    pagination: GalleryCategoryPaginationResult;
  }>;

  /** Find a gallery category by ID */
  findById(id: string): Promise<GalleryCategory | null>;

  /** Find gallery category by name (for duplicate checking) */
  findByName(name: string): Promise<GalleryCategory | null>;

  /** Create a new gallery category */
  create(
    data: CreateGalleryCategoryInput,
    userId: string,
  ): Promise<GalleryCategory>;

  /** Update an existing gallery category */
  update(
    id: string,
    data: UpdateGalleryCategoryInput,
    userId: string,
  ): Promise<GalleryCategory>;

  /** Delete a gallery category */
  delete(id: string, userId: string): Promise<void>;

  /** Count gallery categories with optional filter */
  count(where?: GalleryCategoryFilter): Promise<number>;

  /** Get aggregated gallery category statistics */
  getStats(where?: GalleryCategoryFilter): Promise<GalleryCategoryStats>;
}
