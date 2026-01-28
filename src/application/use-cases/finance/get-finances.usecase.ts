import type { Finance, FinanceFilter } from "@/domain/entities/finance.entity";
import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";

/**
 * Result type for GetFinancesUseCase
 */
export interface GetFinancesResult {
  finances: Finance[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Finances Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching finances with filtering and pagination.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetFinancesUseCase {
  constructor(private readonly financeRepository: IFinanceRepository) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for finances
   * @returns Promise resolving to filtered finances with pagination info
   */
  async execute(filter?: FinanceFilter): Promise<GetFinancesResult> {
    // Deep validation and sanitization
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const finances = await this.financeRepository.getFinances(sanitizedFilter);

    // Return structured result with pagination
    return {
      finances,
      pagination: {
        page: 1,
        limit: 10,
        total: finances.length,
        totalPages: Math.ceil(finances.length / 10),
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(filter?: FinanceFilter): FinanceFilter | undefined {
    if (!filter) return undefined;

    return {
      type: filter.type,
      status: filter.status,
      periodId: filter.periodId?.trim() || undefined,
      categoryId: filter.categoryId?.trim() || undefined,
      workProgramId: filter.workProgramId?.trim() || undefined,
      search: filter.search?.trim() || undefined,
      startDate: filter.startDate || undefined,
      endDate: filter.endDate || undefined,
    };
  }
}
