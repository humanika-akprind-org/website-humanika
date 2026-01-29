/**
 * Update Gallery Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryRepository } from "@/application/interface/gallery.repository.interface";
import type {
  UpdateGalleryInput,
  Gallery,
} from "@/domain/entities/gallery.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class UpdateGalleryUseCase {
  constructor(private galleryRepo: IGalleryRepository) {}

  /**
   * Execute the use case to update a gallery
   */
  async execute(
    id: string,
    input: UpdateGalleryInput,
    user: UserWithId,
  ): Promise<Gallery> {
    // 1. Check if gallery exists
    const existingGallery = await this.galleryRepo.findById(id);
    if (!existingGallery) {
      throw new Error("Gallery not found");
    }

    // 2. Validate input
    this.validateInput(input);

    // 3. Update the gallery
    const gallery = await this.galleryRepo.update(id, input, user.id);

    // 4. Log activity
    await this.logUpdate(user, gallery, existingGallery);

    return gallery;
  }

  /**
   * Validate input fields
   */
  private validateInput(input: UpdateGalleryInput): void {
    if (input.title !== undefined && input.title.trim() === "") {
      throw new Error("Title cannot be empty");
    }
  }

  /**
   * Log the gallery update activity
   */
  private async logActivity(
    userId: string,
    activityType: ActivityType,
    entityType: string,
    entityId: string,
    description: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    });
  }

  /**
   * Log the update activity
   */
  private async logUpdate(
    user: UserWithId,
    gallery: Gallery,
    previousGallery: Gallery,
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.UPDATE,
      "Gallery",
      gallery.id,
      `Updated gallery: ${gallery.title}`,
      {
        previousData: {
          title: previousGallery.title,
        },
        newData: {
          title: gallery.title,
        },
      },
    );
  }
}
