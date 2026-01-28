/**
 * Statistic Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for statistic data operations.
 * All repository implementations must implement these methods.
 */

import type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";

// ============================================================================
// Pagination Types
// ============================================================================

export interface StatisticPaginationInput {
  page: number;
  limit: number;
}

export interface StatisticPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface StatisticResult {
  statistics: Statistic[];
  pagination: StatisticPagination;
}

// ============================================================================
// Repository Interface
// ============================================================================

export interface IStatisticRepository {
  /**
   * Get all statistics with optional filtering
   *
   * @param filter - Optional filter criteria
   * @param pagination - Optional pagination parameters (input only)
   * @returns Paginated statistics
   */
  findMany(
    filter?: StatisticFilter,
    pagination?: StatisticPaginationInput,
  ): Promise<StatisticResult>;

  /**
   * Get a single statistic by ID
   *
   * @param id - Statistic ID
   * @returns The statistic or null if not found
   */
  findById(id: string): Promise<Statistic | null>;

  /**
   * Get statistic by period ID
   *
   * @param periodId - Period ID
   * @returns The statistic or null if not found
   */
  findByPeriodId(periodId: string): Promise<Statistic | null>;

  /**
   * Get the active period statistic
   *
   * @returns The active period statistic or null if not found
   */
  findActivePeriod(): Promise<Statistic | null>;

  /**
   * Create a new statistic
   *
   * @param data - Statistic data
   * @param userId - ID of the user creating the statistic
   * @returns The created statistic
   */
  create(data: CreateStatisticInput, userId: string): Promise<Statistic>;

  /**
   * Update an existing statistic
   *
   * @param id - Statistic ID
   * @param data - Update data
   * @param userId - ID of the user updating the statistic
   * @returns The updated statistic
   */
  update(
    id: string,
    data: UpdateStatisticInput,
    userId: string,
  ): Promise<Statistic>;

  /**
   * Delete a statistic
   *
   * @param id - Statistic ID
   * @param userId - ID of the user deleting the statistic
   */
  delete(id: string, userId: string): Promise<void>;
}
