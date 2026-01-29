import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  ArticleCategory,
  CreateArticleCategoryInput,
} from "@/domain/value-objects/article-category";

// Re-export base types with ArticleCategory-specific names for convenience
export type { BasePagination as ArticleCategoryPagination };
export type { BasePaginationResult as ArticleCategoryPaginationResult };
export type { BaseFilter as CategoryFilter };
export type { BaseStats as ArticleCategoryStats };

/**
 * Article Category Filter
 */
export interface ArticleCategoryFilter extends BaseFilter {
  search?: string;
  withCount?: boolean;
}

/**
 * Article Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines ArticleCategory-specific operations.
 */
export interface IArticleCategoryRepository {
  /** Find all article categories */
  findAll(): Promise<ArticleCategory[]>;

  /** Find an article category by ID */
  findById(id: string): Promise<ArticleCategory | null>;

  /** Find article categories with pagination */
  findMany(
    filters?: ArticleCategoryFilter,
    pagination?: BasePagination,
  ): Promise<{ records: ArticleCategory[]; pagination: BasePaginationResult }>;

  /** Create a new article category */
  create(
    data: CreateArticleCategoryInput,
    userId: string,
  ): Promise<ArticleCategory>;

  /** Update an existing article category */
  update(
    id: string,
    data: Partial<CreateArticleCategoryInput>,
  ): Promise<ArticleCategory>;

  /** Delete an article category */
  delete(id: string): Promise<void>;

  /** Count article categories with optional filter */
  count(where?: BaseFilter): Promise<number>;

  // Aliases for backward compatibility with existing use cases
  getArticleCategoryById(id: string): Promise<ArticleCategory | null>;
  getArticleCategories(
    filter?: ArticleCategoryFilter,
  ): Promise<ArticleCategory[]>;
  getArticleCategoriesWithCount(
    filter?: ArticleCategoryFilter,
  ): Promise<ArticleCategory[]>;
  createArticleCategory(
    data: CreateArticleCategoryInput,
    userId: string,
  ): Promise<ArticleCategory>;
  updateCategory(
    id: string,
    data: Partial<CreateArticleCategoryInput>,
  ): Promise<ArticleCategory>;
  deleteCategory(id: string): Promise<void>;
}
