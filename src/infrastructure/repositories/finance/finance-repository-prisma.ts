/**
 * Finance Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IFinanceRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IFinanceRepository,
  FinanceFilter,
  FinancePagination,
  FinancePaginationResult,
} from "@/application/interface/finance.repository.interface";
import type {
  Finance,
  CreateFinanceInput,
} from "@/domain/entities/finance.entity";
import type { FinanceType, Status } from "@/domain/enums";
import {
  getFinances,
  getFinance,
  createFinance,
  updateFinance,
  deleteFinance,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

// Type alias for filter
type GetFinancesFilter = {
  type?: FinanceType;
  status?: Status;
  workProgramId?: string;
  categoryId?: string;
  userId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
};

/**
 * Finance Repository Prisma Implementation
 *
 * This class implements the IFinanceRepository interface
 * for Clean Architecture compliance.
 */
export class FinanceRepositoryPrisma implements IFinanceRepository {
  /**
   * Get all finances
   */
  async findAll(): Promise<Finance[]> {
    return (await getFinances({})) as unknown as Finance[];
  }

  /**
   * Get all finances with optional filtering and pagination
   */
  async findMany(
    filter?: FinanceFilter,
    pagination?: FinancePagination,
  ): Promise<{ records: Finance[]; pagination: FinancePaginationResult }> {
    const filterParam: GetFinancesFilter = {};
    if (filter?.type) {
      filterParam.type = filter.type;
    }
    if (filter?.status) {
      filterParam.status = filter.status;
    }
    if (filter?.workProgramId) {
      filterParam.workProgramId = filter.workProgramId;
    }
    if (filter?.categoryId) {
      filterParam.categoryId = filter.categoryId;
    }
    if (filter?.search) {
      filterParam.search = filter.search;
    }
    if (filter?.startDate) {
      filterParam.startDate = filter.startDate;
    }
    if (filter?.endDate) {
      filterParam.endDate = filter.endDate;
    }
    const records = await getFinances(filterParam);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated records
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as unknown as Finance[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single finance by ID
   */
  async findById(id: string): Promise<Finance | null> {
    return (await getFinance(id)) as Finance | null;
  }

  /**
   * Create a new finance
   */
  async create(data: CreateFinanceInput, user: UserWithId): Promise<Finance> {
    return (await createFinance(data, user)) as unknown as Finance;
  }

  /**
   * Update an existing finance
   */
  async update(
    id: string,
    data: Partial<CreateFinanceInput>,
  ): Promise<Finance> {
    // Create a dummy user for backward compatibility with update function
    const user: UserWithId = { id: "" };
    return (await updateFinance(id, data, user)) as unknown as Finance;
  }

  /**
   * Delete a finance
   */
  async delete(id: string): Promise<void> {
    // Create a dummy user for backward compatibility with delete function
    const user: UserWithId = { id: "" };
    await deleteFinance(id, user);
  }

  /**
   * Count finances with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const filterParam: GetFinancesFilter = {};
    if (where?.categoryId) {
      filterParam.categoryId = where.categoryId as string;
    }
    if (where?.workProgramId) {
      filterParam.workProgramId = where.workProgramId as string;
    }
    if (where?.type) {
      filterParam.type = where.type as FinanceType;
    }
    if (where?.status) {
      filterParam.status = where.status as Status;
    }
    const records = await getFinances(filterParam);
    return records.length;
  }
}
