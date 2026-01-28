/**
 * Get Gallery Categories Use Case - Simple read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type { GalleryCategory } from "@/domain/value-objects/gallery-category";

export class GetGalleryCategoriesUseCase {
  constructor(private categoryRepo: IGalleryCategoryRepository) {}

  /**
   * Execute the use case to get all gallery categories
   */
  async execute(): Promise<GalleryCategory[]> {
    return await this.categoryRepo.findAll();
  }
}
