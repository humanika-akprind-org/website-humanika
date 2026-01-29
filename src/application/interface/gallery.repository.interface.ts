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

/**
 * Gallery Category Filter
 */
export interface GalleryFilter extends BaseFilter {
  search?: string;
}

// Define Gallery-specific type aliases
export type GalleryPagination = BasePagination;
export type GalleryPaginationResult = BasePaginationResult;
export type GalleryStats = BaseStats;

/**
 * Gallery Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Gallery-specific operations.
 */
export interface IGalleryRepository {
  /** Find all galleries */
  findAll(): Promise<Gallery[]>;

  /** Find galleries with filters and pagination */
  findMany(
    filters?: GalleryFilter,
    pagination?: GalleryPagination,
  ): Promise<{ records: Gallery[]; pagination: GalleryPaginationResult }>;

  /** Find a gallery by ID */
  findById(id: string): Promise<Gallery | null>;

  /** Find galleries by event */
  findByEvent(eventId: string): Promise<Gallery[]>;

  /** Find galleries by category */
  findByCategory(categoryId: string): Promise<Gallery[]>;

  /** Create a new gallery */
  create(data: CreateGalleryInput, userId: string): Promise<Gallery>;

  /** Update an existing gallery */
  update(
    id: string,
    data: UpdateGalleryInput,
    userId: string,
  ): Promise<Gallery>;

  /** Delete a gallery */
  delete(id: string, userId: string): Promise<void>;

  /** Count galleries with optional filter */
  count(where?: GalleryFilter): Promise<number>;

  /** Get aggregated gallery statistics */
  getStats(where?: GalleryFilter): Promise<GalleryStats>;
}
