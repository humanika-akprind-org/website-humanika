/**
 * Create Gallery Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating galleries with:
 * - Input validation
 * - Activity logging
 */

import type { IGalleryRepository } from "@/application/interface/gallery.repository.interface";
import type {
  CreateGalleryInput,
  Gallery,
} from "@/domain/entities/gallery.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class CreateGalleryUseCase {
  constructor(private galleryRepo: IGalleryRepository) {}

  /**
   * Execute the use case to create a new gallery
   *
   * @param input - Validated gallery input data
   * @param user - The user creating the gallery
   * @returns The created gallery
   */
  async execute(input: CreateGalleryInput, user: UserWithId): Promise<Gallery> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Create the gallery
    const gallery = await this.galleryRepo.create(input);

    // 3. Log activity
    await this.logCreation(user, gallery);

    return gallery;
  }

  /**
   * Validate required fields for gallery creation
   */
  private validateInput(input: CreateGalleryInput): void {
    const errors: string[] = [];

    if (!input.title || input.title.trim() === "") {
      errors.push("Title is required");
    }

    if (!input.eventId) {
      errors.push("Event ID is required");
    }

    if (!input.image || input.image.trim() === "") {
      errors.push("Image is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Log the gallery creation activity
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
   * Log the creation activity
   */
  private async logCreation(user: UserWithId, gallery: Gallery): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.CREATE,
      "Gallery",
      gallery.id,
      `Created gallery: ${gallery.title}`,
      {
        newData: {
          title: gallery.title,
          eventId: gallery.eventId,
          categoryId: gallery.categoryId,
          periodId: gallery.periodId,
          image: gallery.image,
        },
      },
    );
  }
}
