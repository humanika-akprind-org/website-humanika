import type {
  CreateArticleInput,
  Article,
  ArticleFilter,
} from "@/domain/entities/article.entity";

/**
 * Article Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for article data access operations.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */
export interface IArticleRepository {
  /**
   * Get all articles with optional filters
   */
  getArticles(filter?: ArticleFilter): Promise<Article[]>;

  /**
   * Get a single article by ID
   */
  getArticleById(id: string): Promise<Article | null>;

  /**
   * Get a single article by slug
   */
  getArticleBySlug(slug: string): Promise<Article | null>;

  /**
   * Create a new article
   */
  createArticle(
    data: CreateArticleInput,
    user: { id: string },
  ): Promise<Article>;

  /**
   * Update an existing article
   */
  updateArticle(
    id: string,
    data: Partial<CreateArticleInput>,
  ): Promise<Article>;

  /**
   * Delete an article
   */
  deleteArticle(id: string): Promise<void>;
}
