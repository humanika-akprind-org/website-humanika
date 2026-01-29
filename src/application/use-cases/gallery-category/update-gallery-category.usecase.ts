/**
 * Update Gallery Category Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type {
  UpdateGalleryCategoryInput,
  GalleryCategory,
} from "@/domain/value-objects/gallery-category";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class UpdateGalleryCategoryUseCase {
  constructor(private categoryRepo: IGalleryCategoryRepository) {}

  /**
   * Execute the use case to update a gallery category
   */
  async execute(
    id: string,
    input: UpdateGalleryCategoryInput,
    user: UserWithId,
  ): Promise<GalleryCategory> {
    // 1. Check if category exists
    const existingCategory = await this.categoryRepo.findById(id);
    if (!existingCategory) {
      throw new Error("Gallery category not found");
    }

    // 2. Validate input
    this.validateInput(input);

    // 3. Check for duplicates if name is being changed
    if (input.name) {
      await this.checkDuplicate(input.name, id);
    }

    // 4. Update the category
    const category = await this.categoryRepo.update(id, input, user.id);

    // 5. Log activity
    await this.logUpdate(user, category, existingCategory);

    return category;
  }

  /**
   * Validate input fields
   */
  private validateInput(input: UpdateGalleryCategoryInput): void {
    const errors: string[] = [];

    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check for duplicate category names
   */
  private async checkDuplicate(name: string, excludeId: string): Promise<void> {
    const existingCategory = await this.categoryRepo.findByName(name);
    if (existingCategory && existingCategory.id !== excludeId) {
      throw new Error("A category with this name already exists");
    }
  }

  /**
   * Log the category update activity
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
    category: GalleryCategory,
    previousCategory: GalleryCategory,
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.UPDATE,
      "GalleryCategory",
      category.id,
      `Updated gallery category: ${category.name}`,
      {
        previousData: {
          name: previousCategory.name,
        },
        newData: {
          name: category.name,
        },
      },
    );
  }
}
