/**
 * Get Gallery Category By ID Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type { GalleryCategory } from "@/domain/value-objects/gallery-category";

export class GetGalleryCategoryByIdUseCase {
  constructor(private categoryRepo: IGalleryCategoryRepository) {}

  /**
   * Execute the use case to get a gallery category by ID
   */
  async execute(id: string): Promise<GalleryCategory | null> {
    return await this.categoryRepo.findById(id);
  }
}
