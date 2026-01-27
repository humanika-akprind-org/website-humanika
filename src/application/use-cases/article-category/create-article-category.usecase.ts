import type {
  ArticleCategory,
  CreateArticleCategoryInput,
} from "@/domain/value-objects/article-category";
import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";

/**
 * Create Article Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating article categories with validation.
 */
export class CreateArticleCategoryUseCase {
  constructor(
    private readonly categoryRepository: IArticleCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param input - Category creation input data
   * @param userId - User ID for logging
   * @returns Promise resolving to created category
   */
  async execute(
    input: CreateArticleCategoryInput,
    userId: string,
  ): Promise<ArticleCategory> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const category = await this.categoryRepository.createArticleCategory(
      input,
      userId,
    );

    return category;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateArticleCategoryInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Category name is required");
    } else if (input.name.trim().length < 2) {
      errors.push("Category name must be at least 2 characters");
    } else if (input.name.trim().length > 100) {
      errors.push("Category name must be less than 100 characters");
    }

    // Description validation (optional)
    if (input.description && input.description.length > 500) {
      errors.push("Description must be less than 500 characters");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
