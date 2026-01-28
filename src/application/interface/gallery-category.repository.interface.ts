/**
 * Gallery Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 */

import type {
  GalleryCategory,
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/domain/value-objects/gallery-category";

// Gallery Category-specific repository interface
export interface IGalleryCategoryRepository {
  /** Find all gallery categories */
  findAll(): Promise<GalleryCategory[]>;

  /** Find a gallery category by ID */
  findById(id: string): Promise<GalleryCategory | null>;

  /** Find gallery category by name */
  findByName(name: string): Promise<GalleryCategory | null>;

  /** Create a gallery category */
  create(data: CreateGalleryCategoryInput): Promise<GalleryCategory>;

  /** Update an existing gallery category */
  update(
    id: string,
    data: UpdateGalleryCategoryInput,
  ): Promise<GalleryCategory>;

  /** Delete a gallery category */
  delete(id: string): Promise<void>;

  /** Count gallery categories */
  count(where?: unknown): Promise<number>;
}
