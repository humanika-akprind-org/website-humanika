/**
 * Statistic Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository wraps existing statistic functions
 * and implements the IStatisticRepository interface.
 */

import type {
  IStatisticRepository,
  StatisticPagination,
  StatisticResult,
} from "@/application/interface/statistic.repository.interface";
import type {
  Statistic,
  CreateStatisticInput,
  UpdateStatisticInput,
  StatisticFilter,
} from "@/domain/entities/statistic.entity";
import {
  getStatistics,
  getStatistic,
  getStatisticByPeriod,
  getActivePeriodStatistic,
  createStatistic,
  updateStatistic,
  deleteStatistic,
} from "./index";

/**
 * Statistic Repository Prisma Implementation
 *
 * This class wraps existing repository functions to implement
 * the standardized repository interface for Clean Architecture.
 */
export class StatisticRepositoryPrisma implements IStatisticRepository {
  /**
   * Get all statistics with optional filtering and pagination
   */
  async findMany(
    filter?: StatisticFilter,
    pagination?: StatisticPagination,
  ): Promise<StatisticResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Get all statistics (the existing function doesn't support pagination)
    const statistics = await getStatistics(filter);

    // Calculate pagination metadata
    const total = statistics.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Apply pagination to results
    const paginatedStatistics = statistics.slice(startIndex, endIndex);

    return {
      statistics: paginatedStatistics,
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
    return getStatistic(id);
  }

  /**
   * Get statistic by period ID
   */
  async findByPeriodId(periodId: string): Promise<Statistic | null> {
    return getStatisticByPeriod(periodId);
  }

  /**
   * Get the active period statistic
   */
  async findActivePeriod(): Promise<Statistic | null> {
    return getActivePeriodStatistic();
  }

  /**
   * Create a new statistic
   */
  async create(data: CreateStatisticInput, userId: string): Promise<Statistic> {
    // The existing create function expects a user object with id
    return createStatistic(data, { id: userId } as { id: string });
  }

  /**
   * Update an existing statistic
   */
  async update(
    id: string,
    data: UpdateStatisticInput,
    userId: string,
  ): Promise<Statistic> {
    // The existing update function expects a user object with id
    return updateStatistic(id, data, { id: userId } as { id: string });
  }

  /**
   * Delete a statistic
   */
  async delete(id: string, userId: string): Promise<void> {
    // The existing delete function expects a user object with id
    await deleteStatistic(id, { id: userId } as { id: string });
  }
}
