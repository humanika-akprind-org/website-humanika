import type {
  UpdateArticleInput,
  Article,
} from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Update Article Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating articles with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class UpdateArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the article to update
   * @param input - Article update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated article
   */
  async execute(
    id: string,
    input: UpdateArticleInput,
    _user: { id: string },
  ): Promise<Article> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Article ID is required");
    }

    // Validate input
    this.validateInput(input);

    // Execute repository call
    const article = await this.articleRepository.updateArticle(
      id.trim(),
      input,
    );

    return article;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateArticleInput): void {
    const errors: string[] = [];

    // Title validation (optional but if provided must be valid)
    if (input.title !== undefined) {
      if (input.title.trim() === "") {
        errors.push("Title cannot be empty if provided");
      } else if (input.title.length < 3) {
        errors.push("Title must be at least 3 characters");
      } else if (input.title.length > 255) {
        errors.push("Title must be less than 255 characters");
      }
    }

    // Content validation (optional but if provided must be valid)
    if (input.content !== undefined) {
      if (input.content.trim() === "") {
        errors.push("Content cannot be empty if provided");
      } else if (input.content.length < 10) {
        errors.push("Content must be at least 10 characters");
      }
    }

    // Category ID validation (optional but if provided must be valid)
    if (input.categoryId !== undefined && input.categoryId.trim() === "") {
      errors.push("Category ID cannot be empty if provided");
    }

    // Period ID validation (optional but if provided must be valid)
    if (input.periodId !== undefined && input.periodId.trim() === "") {
      errors.push("Period ID cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
