import type { Article } from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Get Article By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single article by its ID.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetArticleByIdUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the article to fetch
   * @returns Promise resolving to the article or null if not found
   */
  async execute(id: string): Promise<Article | null> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Article ID is required");
    }

    // Sanitize ID
    const sanitizedId = id.trim();

    // Execute repository call
    const article = await this.articleRepository.getArticleById(sanitizedId);

    // Throw error if article not found
    if (!article) {
      throw new Error("Article not found");
    }

    return article;
  }
}
