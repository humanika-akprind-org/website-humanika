/**
 * Get Gallery By ID Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryRepository } from "@/application/interface/gallery.repository.interface";
import type { Gallery } from "@/domain/entities/gallery.entity";

export class GetGalleryByIdUseCase {
  constructor(private galleryRepo: IGalleryRepository) {}

  /**
   * Execute the use case to get a gallery by ID
   */
  async execute(id: string): Promise<Gallery | null> {
    const gallery = await this.galleryRepo.findById(id);

    if (!gallery) {
      throw new Error("Gallery not found");
    }

    return gallery;
  }
}
