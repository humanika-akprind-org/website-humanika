/**
 * Statistic Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IStatisticRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IStatisticRepository,
  StatisticFilter,
  StatisticPagination,
  StatisticPaginationResult,
  StatisticStats,
} from "@/application/interface/statistic.repository.interface";
import type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
} from "@/domain/entities/statistic.entity";
import {
  getStatistics,
  getStatisticById,
  getStatisticByPeriod,
  getActivePeriodStatistic,
  createStatistic,
  updateStatistic,
  deleteStatistic,
  getStatisticStats,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Statistic Repository Prisma Implementation
 *
 * This class implements the IStatisticRepository interface
 * for Clean Architecture compliance.
 */
export class StatisticRepositoryPrisma implements IStatisticRepository {
  /**
   * Get all statistics
   */
  async findAll(): Promise<Statistic[]> {
    return (await getStatistics()) as Statistic[];
  }

  /**
   * Get all statistics with optional filtering and pagination
   */
  async findMany(
    filter?: StatisticFilter,
    pagination?: StatisticPagination,
  ): Promise<{ records: Statistic[]; pagination: StatisticPaginationResult }> {
    const records = await getStatistics(filter);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated statistics
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as Statistic[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single statistic by ID
   */
  async findById(id: string): Promise<Statistic | null> {
    return (await getStatisticById(id)) as Statistic | null;
  }

  /**
   * Get statistic by period ID
   */
  async findByPeriodId(periodId: string): Promise<Statistic | null> {
    return (await getStatisticByPeriod(periodId)) as Statistic | null;
  }

  /**
   * Get the active period statistic
   */
  async findActivePeriod(): Promise<Statistic | null> {
    return (await getActivePeriodStatistic()) as Statistic | null;
  }

  /**
   * Create a new statistic
   */
  async create(data: CreateStatisticInput, userId: string): Promise<Statistic> {
    const user: UserWithId = { id: userId };
    return await createStatistic(data, user);
  }

  /**
   * Update an existing statistic
   */
  async update(
    id: string,
    data: UpdateStatisticInput,
    userId: string,
  ): Promise<Statistic> {
    const user: UserWithId = { id: userId };
    return await updateStatistic(id, data, user);
  }

  /**
   * Delete a statistic
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteStatistic(id, user);
  }

  /**
   * Count statistics with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const statistics = await getStatistics({
      periodId: where?.periodId as string,
    });
    return statistics.length;
  }

  /**
   * Get aggregated statistics
   */
  async getStats(where?: Record<string, unknown>): Promise<StatisticStats> {
    return await getStatisticStats(where);
  }
}
