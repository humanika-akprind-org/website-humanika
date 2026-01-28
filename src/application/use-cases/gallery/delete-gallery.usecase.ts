/**
 * Delete Gallery Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryRepository } from "@/application/interface/gallery.repository.interface";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DeleteGalleryUseCase {
  constructor(private galleryRepo: IGalleryRepository) {}

  /**
   * Execute the use case to delete a gallery
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Check if gallery exists
    const existingGallery = await this.galleryRepo.findById(id);
    if (!existingGallery) {
      throw new Error("Gallery not found");
    }

    // 2. Store data for logging before deletion
    const galleryData = {
      id: existingGallery.id,
      title: existingGallery.title,
    };

    // 3. Delete the gallery
    await this.galleryRepo.delete(id);

    // 4. Log activity
    await this.logDeletion(user, galleryData);
  }

  /**
   * Log the gallery deletion activity
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
   * Log the deletion activity
   */
  private async logDeletion(
    user: UserWithId,
    galleryData: { id: string; title: string },
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.DELETE,
      "Gallery",
      galleryData.id,
      `Deleted gallery: ${galleryData.title}`,
      {
        deletedData: {
          id: galleryData.id,
          title: galleryData.title,
        },
      },
    );
  }
}
