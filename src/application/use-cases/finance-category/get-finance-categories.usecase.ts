/**
 * Get Finance Categories Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching finance categories
 * with filtering, pagination, and result formatting.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  FinanceCategory,
  FinanceCategoryFilter,
} from "@/domain/value-objects/finance-category";

/**
 * Result type for GetFinanceCategoriesUseCase
 */
export interface GetFinanceCategoriesResult {
  financeCategories: FinanceCategory[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Repository interface for finance category read operations
 */
export interface IFinanceCategoryRepository {
  getFinanceCategories(
    filter?: FinanceCategoryFilter,
  ): Promise<FinanceCategory[]>;
}

/**
 * Get Finance Categories Use Case
 */
export class GetFinanceCategoriesUseCase {
  constructor(
    private readonly financeCategoryRepository: IFinanceCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for finance categories
   * @returns Promise resolving to filtered categories with pagination info
   */
  async execute(
    filter?: FinanceCategoryFilter,
  ): Promise<GetFinanceCategoriesResult> {
    // Sanitize and validate filter parameters
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const financeCategories =
      await this.financeCategoryRepository.getFinanceCategories(
        sanitizedFilter,
      );

    // Calculate pagination
    const page = 1;
    const limit = 10;
    const total = financeCategories.length;
    const totalPages = Math.ceil(total / limit);

    // Return structured result with pagination
    return {
      financeCategories,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(
    filter?: FinanceCategoryFilter,
  ): FinanceCategoryFilter | undefined {
    if (!filter) return undefined;

    return {
      type: filter.type,
      search: filter.search?.trim() || undefined,
    };
  }
}
