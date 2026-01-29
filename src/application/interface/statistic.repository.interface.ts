import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";

/**
 * Statistic Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Statistic-specific operations.
 */
export interface IStatisticRepository {
  /** Find all statistics */
  findAll(): Promise<Statistic[]>;

  /** Find a statistic by ID */
  findById(id: string): Promise<Statistic | null>;

  /** Find statistics with filters and pagination */
  findMany(
    filters?: StatisticFilter,
    pagination?: BasePagination,
  ): Promise<{ records: Statistic[]; pagination: BasePaginationResult }>;

  /** Find statistic by period ID */
  findByPeriodId(periodId: string): Promise<Statistic | null>;

  /** Find the active period statistic */
  findActivePeriod(): Promise<Statistic | null>;

  /** Create a new statistic */
  create(data: CreateStatisticInput, userId: string): Promise<Statistic>;

  /** Update an existing statistic */
  update(id: string, data: UpdateStatisticInput): Promise<Statistic>;

  /** Delete a statistic */
  delete(id: string, userId: string): Promise<void>;

  /** Count statistics with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { StatisticFilter };

// Re-export base types with Statistic-specific names for convenience
export type { BasePagination as StatisticPagination };
export type { BasePaginationResult as StatisticPaginationResult };
export type { BaseStats as StatisticStats };
