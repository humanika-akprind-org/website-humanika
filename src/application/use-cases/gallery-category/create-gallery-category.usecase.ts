/**
 * Create Gallery Category Use Case - Simple write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

import type { IGalleryCategoryRepository } from "@/application/interface/gallery-category.repository.interface";
import type {
  CreateGalleryCategoryInput,
  GalleryCategory,
} from "@/domain/value-objects/gallery-category";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class CreateGalleryCategoryUseCase {
  constructor(private categoryRepo: IGalleryCategoryRepository) {}

  /**
   * Execute the use case to create a new gallery category
   */
  async execute(
    input: CreateGalleryCategoryInput,
    user: UserWithId,
  ): Promise<GalleryCategory> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates
    await this.checkDuplicate(input);

    // 3. Create the category
    const category = await this.categoryRepo.create(input, user.id);

    // 4. Log activity
    await this.logCreation(user, category);

    return category;
  }

  /**
   * Validate required fields
   */
  private validateInput(input: CreateGalleryCategoryInput): void {
    const errors: string[] = [];

    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check for duplicate category names
   */
  private async checkDuplicate(
    input: CreateGalleryCategoryInput,
  ): Promise<void> {
    const existingCategory = await this.categoryRepo.findByName(input.name);
    if (existingCategory) {
      throw new Error("A category with this name already exists");
    }
  }

  /**
   * Log the category creation activity
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
  private async logCreation(
    user: UserWithId,
    category: GalleryCategory,
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.CREATE,
      "GalleryCategory",
      category.id,
      `Created gallery category: ${category.name}`,
      {
        newData: {
          name: category.name,
          description: category.description,
        },
      },
    );
  }
}
