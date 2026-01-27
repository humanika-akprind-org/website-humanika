import type { ArticleCategory } from "@/domain/value-objects/article-category";
import type { CategoryFilter } from "@/application/interface/article-category.repository.interface";
import type { IArticleCategoryRepository } from "@/application/interface/article-category.repository.interface";

/**
 * Get Article Categories Result
 */
export interface GetArticleCategoriesResult {
  categories: ArticleCategory[];
  filter: CategoryFilter;
}

/**
 * Get Article Categories Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching article categories.
 */
export class GetArticleCategoriesUseCase {
  constructor(
    private readonly categoryRepository: IArticleCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for categories
   * @returns Promise resolving to categories
   */
  async execute(filter?: CategoryFilter): Promise<GetArticleCategoriesResult> {
    // Determine which method to call based on filter
    const categories = filter?.withCount
      ? await this.categoryRepository.getArticleCategoriesWithCount()
      : await this.categoryRepository.getArticleCategories();

    return {
      categories,
      filter: filter || {},
    };
  }
}
