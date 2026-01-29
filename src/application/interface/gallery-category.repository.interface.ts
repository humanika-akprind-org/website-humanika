import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";

/**
 * Gallery Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines GalleryCategory-specific operations.
 */
export interface IGalleryCategoryRepository {
  /** Find all gallery categories */
  findAll(): Promise<GalleryCategory[]>;

  /** Find a gallery category by ID */
  findById(id: string): Promise<GalleryCategory | null>;

  /** Find gallery category by name (for duplicate checking) */
  findByName(name: string): Promise<GalleryCategory | null>;

  /** Find gallery categories with pagination */
  findMany(
    filters?: BaseFilter,
    pagination?: BasePagination,
  ): Promise<{ records: GalleryCategory[]; pagination: BasePaginationResult }>;

  /** Create a new gallery category */
  create(data: CreateGalleryCategoryInput): Promise<GalleryCategory>;

  /** Update an existing gallery category */
  update(
    id: string,
    data: UpdateGalleryCategoryInput,
  ): Promise<GalleryCategory>;

  /** Delete a gallery category */
  delete(id: string): Promise<void>;

  /** Count gallery categories with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

/**
 * Gallery Category Filter
 */
export interface GalleryCategoryFilter extends BaseFilter {
  search?: string;
}
