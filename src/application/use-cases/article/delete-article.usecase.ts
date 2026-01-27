import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Delete Article Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting articles with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class DeleteArticleUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the article to delete
   * @param user - User context for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, _user: { id: string }): Promise<void> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Article ID is required");
    }

    // Check if article exists before deletion
    const article = await this.articleRepository.getArticleById(id.trim());
    if (!article) {
      throw new Error("Article not found");
    }

    // Execute repository call
    await this.articleRepository.deleteArticle(id.trim());
  }
}
