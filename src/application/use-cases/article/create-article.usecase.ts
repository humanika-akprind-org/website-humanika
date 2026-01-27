import type {
  CreateArticleInput,
  Article,
} from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Create Article Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating articles with validation and logging.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class CreateArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param input - Article creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created article
   */
  async execute(
    input: CreateArticleInput,
    user: { id: string },
  ): Promise<Article> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const article = await this.articleRepository.createArticle(input, user);

    return article;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateArticleInput): void {
    const errors: string[] = [];

    // Title validation
    if (!input.title || input.title.trim() === "") {
      errors.push("Title is required");
    } else if (input.title.length < 3) {
      errors.push("Title must be at least 3 characters");
    } else if (input.title.length > 255) {
      errors.push("Title must be less than 255 characters");
    }

    // Content validation
    if (!input.content || input.content.trim() === "") {
      errors.push("Content is required");
    } else if (input.content.length < 10) {
      errors.push("Content must be at least 10 characters");
    }

    // Author ID validation
    if (!input.authorId || input.authorId.trim() === "") {
      errors.push("Author ID is required");
    }

    // Category ID validation
    if (!input.categoryId || input.categoryId.trim() === "") {
      errors.push("Category ID is required");
    }

    // Period ID validation (optional but if provided must be valid)
    if (input.periodId && input.periodId.trim() === "") {
      errors.push("Period ID cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
