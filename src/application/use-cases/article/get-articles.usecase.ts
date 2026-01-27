import type { Article, ArticleFilter } from "@/domain/entities/article.entity";
import type { IArticleRepository } from "@/application/interface/article.repository.interface";

/**
 * Result type for GetArticlesUseCase
 */
export interface GetArticlesResult {
  articles: Article[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Articles Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching articles with filtering and pagination.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetArticlesUseCase {
  constructor(private readonly articleRepository: IArticleRepository) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for articles
   * @returns Promise resolving to filtered articles with pagination info
   */
  async execute(filter?: ArticleFilter): Promise<GetArticlesResult> {
    // Deep validation and sanitization
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const articles = await this.articleRepository.getArticles(sanitizedFilter);

    // Return structured result with pagination
    return {
      articles,
      pagination: {
        page: 1,
        limit: 10,
        total: articles.length,
        totalPages: Math.ceil(articles.length / 10),
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(filter?: ArticleFilter): ArticleFilter | undefined {
    if (!filter) return undefined;

    return {
      status: filter.status,
      periodId: filter.periodId?.trim() || undefined,
      categoryId: filter.categoryId?.trim() || undefined,
      authorId: filter.authorId?.trim() || undefined,
      search: filter.search?.trim() || undefined,
    };
  }
}
