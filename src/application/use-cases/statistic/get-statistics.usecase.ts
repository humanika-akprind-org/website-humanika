/**
 * Get Statistics Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching statistics with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type {
  IStatisticRepository,
  StatisticPaginationInput,
} from "@/application/interface/statistic.repository.interface";
import type {
  Statistic,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";

interface StatisticResult {
  statistics: Statistic[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class GetStatisticsUseCase {
  constructor(private statisticRepo: IStatisticRepository) {}

  /**
   * Execute the use case to get statistics with optional filters and pagination
   *
   * @param filters - Optional filters for querying statistics
   * @param pagination - Optional pagination parameters
   * @returns Statistics with pagination info
   */
  async execute(
    filters?: StatisticFilter,
    pagination?: StatisticPaginationInput,
  ): Promise<StatisticResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Handle special period=active query
    if (filters?.period === "active") {
      const activeStatistic = await this.statisticRepo.findActivePeriod();
      return {
        statistics: activeStatistic ? [activeStatistic] : [],
        pagination: {
          page: 1,
          limit: 1,
          total: activeStatistic ? 1 : 0,
          totalPages: 1,
        },
      };
    }

    // Execute the repository method
    const result = await this.statisticRepo.findMany(filters, {
      page,
      limit,
    });

    return {
      statistics: result.statistics,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   * Useful for converting URL search params to filters
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<StatisticResult> {
    const filters: StatisticFilter = {
      periodId: searchParams.get("periodId") || undefined,
      period: searchParams.get("period") || undefined,
    };

    const pagination: StatisticPaginationInput = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}
