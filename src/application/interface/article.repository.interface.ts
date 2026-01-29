import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  CreateArticleInput,
  Article,
  ArticleFilter,
} from "@/domain/entities/article.entity";

/**
 * Article Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Article-specific operations.
 */
export interface IArticleRepository {
  /** Find all articles */
  findAll(): Promise<Article[]>;

  /** Find an article by ID */
  findById(id: string): Promise<Article | null>;

  /** Find an article by slug */
  findBySlug(slug: string): Promise<Article | null>;

  /** Find articles with filters and pagination */
  findMany(
    filters?: ArticleFilter,
    pagination?: BasePagination,
  ): Promise<{ records: Article[]; pagination: BasePaginationResult }>;

  /** Create a new article */
  create(data: CreateArticleInput, user: { id: string }): Promise<Article>;

  /** Update an existing article */
  update(id: string, data: Partial<CreateArticleInput>): Promise<Article>;

  /** Delete an article */
  delete(id: string): Promise<void>;

  /** Count articles with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export ArticleFilter for convenience
export type { ArticleFilter };
