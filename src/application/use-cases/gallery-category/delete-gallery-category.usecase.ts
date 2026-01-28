/**
 * Delete Gallery Category Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DeleteGalleryCategoryUseCase {
  constructor(private categoryRepo: IGalleryCategoryRepository) {}

  /**
   * Execute the use case to delete a gallery category
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Check if category exists
    const existingCategory = await this.categoryRepo.findById(id);
    if (!existingCategory) {
      throw new Error("Gallery category not found");
    }

    // 2. Store data for logging before deletion
    const categoryData = {
      id: existingCategory.id,
      name: existingCategory.name,
    };

    // 3. Delete the category
    await this.categoryRepo.delete(id);

    // 4. Log activity
    await this.logDeletion(user, categoryData);
  }

  /**
   * Log the category deletion activity
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
    categoryData: { id: string; name: string },
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.DELETE,
      "GalleryCategory",
      categoryData.id,
      `Deleted gallery category: ${categoryData.name}`,
      {
        deletedData: {
          id: categoryData.id,
          name: categoryData.name,
        },
      },
    );
  }
}
