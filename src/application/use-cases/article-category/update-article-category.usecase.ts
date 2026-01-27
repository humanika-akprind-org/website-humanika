import type {
  ArticleCategory,
  UpdateArticleCategoryInput,
} from "@/domain/value-objects/article-category";
import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";

/**
 * Update Article Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating article categories with validation.
 */
export class UpdateArticleCategoryUseCase {
  constructor(
    private readonly categoryRepository: IArticleCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The ID of the category to update
   * @param input - Category update input data
   * @param userId - User ID for logging
   * @returns Promise resolving to updated category
   */
  async execute(
    id: string,
    input: UpdateArticleCategoryInput,
    _userId: string,
  ): Promise<ArticleCategory> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required");
    }

    // Validate input
    this.validateInput(input);

    // Check if category exists
    const existingCategory =
      await this.categoryRepository.getArticleCategoryById(id.trim());
    if (!existingCategory) {
      throw new Error("Article category not found");
    }

    // Execute repository call
    const category = await this.categoryRepository.updateCategory(
      id.trim(),
      input,
    );

    return category;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateArticleCategoryInput): void {
    const errors: string[] = [];

    // Name validation (optional but if provided must be valid)
    if (input.name !== undefined) {
      if (input.name.trim() === "") {
        errors.push("Name cannot be empty if provided");
      } else if (input.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters");
      } else if (input.name.trim().length > 100) {
        errors.push("Name must be less than 100 characters");
      }
    }

    // Description validation (optional)
    if (input.description !== undefined && input.description.length > 500) {
      errors.push("Description must be less than 500 characters");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
