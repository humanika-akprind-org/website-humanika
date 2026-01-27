import type { Article } from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Get Article By Slug Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single article by its slug.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetArticleBySlugUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param slug - The slug of the article to fetch
   * @returns Promise resolving to the article or null if not found
   */
  async execute(slug: string): Promise<Article | null> {
    // Validate slug parameter
    if (!slug || slug.trim() === "") {
      throw new Error("Slug is required");
    }

    // Sanitize slug
    const sanitizedSlug = slug.trim();

    // Execute repository call
    const article =
      await this.articleRepository.getArticleBySlug(sanitizedSlug);

    return article;
  }
}
