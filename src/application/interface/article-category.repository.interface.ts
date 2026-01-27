import type {
  ArticleCategory,
  CreateArticleCategoryInput,
} from "@/domain/value-objects/article-category";

/**
 * Article Category Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for article category data access operations.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */
export interface IArticleCategoryRepository {
  /**
   * Get all article categories
   */
  getArticleCategories(): Promise<ArticleCategory[]>;

  /**
   * Get all article categories with article count
   */
  getArticleCategoriesWithCount(): Promise<ArticleCategory[]>;

  /**
   * Get a single category by ID
   */
  getArticleCategoryById(id: string): Promise<ArticleCategory | null>;

  /**
   * Create a new article category
   */
  createArticleCategory(
    data: CreateArticleCategoryInput,
    userId: string,
  ): Promise<ArticleCategory>;

  /**
   * Update an existing category
   */
  updateCategory(
    id: string,
    data: Partial<CreateArticleCategoryInput>,
  ): Promise<ArticleCategory>;

  /**
   * Delete a category
   */
  deleteCategory(id: string): Promise<void>;
}

/**
 * Category filter options
 */
export interface CategoryFilter {
  withCount?: boolean;
}
