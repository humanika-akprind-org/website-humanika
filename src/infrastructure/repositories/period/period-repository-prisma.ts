/**
 * Period Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IPeriodRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IPeriodRepository,
  PeriodFilter,
  PeriodPagination,
  PeriodPaginationResult,
} from "@/application/interface/period.repository.interface";
import type { Period, PeriodFormData } from "@/domain/entities/period.entity";
import {
  getPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
} from "./index";

/**
 * Period Repository Prisma Implementation
 *
 * This class implements the IPeriodRepository interface
 * for Clean Architecture compliance.
 */
export class PeriodRepositoryPrisma implements IPeriodRepository {
  /**
   * Get all periods
   */
  async findAll(): Promise<Period[]> {
    return getPeriods();
  }

  /**
   * Get all periods with optional filtering and pagination
   */
  async findMany(
    filters?: PeriodFilter,
    pagination?: PeriodPagination,
  ): Promise<{ records: Period[]; pagination: PeriodPaginationResult }> {
    const records = await getPeriods();

    // Apply filters
    let filteredRecords = records;
    if (filters?.search) {
      filteredRecords = filteredRecords.filter((period) =>
        period.name.toLowerCase().includes(filters.search!.toLowerCase()),
      );
    }
    if (filters?.isActive !== undefined) {
      filteredRecords = filteredRecords.filter(
        (period) => period.isActive === filters.isActive,
      );
    }

    // Get total count for pagination
    const total = filteredRecords.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated periods
    const paginatedRecords = filteredRecords.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as Period[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single period by ID
   */
  async findById(id: string): Promise<Period | null> {
    return getPeriod(id);
  }

  /**
   * Create a new period
   */
  async create(data: PeriodFormData): Promise<Period> {
    return createPeriod(data);
  }

  /**
   * Update an existing period
   */
  async update(id: string, data: Partial<PeriodFormData>): Promise<Period> {
    return updatePeriod(id, data);
  }

  /**
   * Delete a period
   */
  async delete(id: string): Promise<void> {
    return deletePeriod(id);
  }

  /**
   * Count periods with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const periods = await getPeriods();
    let filtered = periods;
    if (where?.search) {
      filtered = filtered.filter((period) =>
        period.name
          .toLowerCase()
          .includes((where.search as string).toLowerCase()),
      );
    }
    if (where?.isActive !== undefined) {
      filtered = filtered.filter(
        (period) => period.isActive === where.isActive,
      );
    }
    return filtered.length;
  }
}
