import type { ArticleCategory } from "@/domain/value-objects/article-category";
import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";

/**
 * Get Article Category By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single category by its ID.
 */
export class GetArticleCategoryByIdUseCase {
  constructor(
    private readonly categoryRepository: IArticleCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The ID of the category to fetch
   * @returns Promise resolving to the category or null if not found
   */
  async execute(id: string): Promise<ArticleCategory | null> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Category ID is required");
    }

    // Sanitize ID
    const sanitizedId = id.trim();

    // Execute repository call
    const category =
      await this.categoryRepository.getArticleCategoryById(sanitizedId);

    return category;
  }
}
