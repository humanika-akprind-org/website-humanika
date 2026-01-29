/**
 * Finance Category Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IFinanceCategoryRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IFinanceCategoryRepository,
  FinanceCategoryFilter,
  FinanceCategoryPagination,
  FinanceCategoryPaginationResult,
} from "@/application/interface/finance-category.repository.interface";
import type {
  FinanceCategory,
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/domain/value-objects/finance-category";
import type { FinanceType } from "@/domain/enums";
import {
  getFinanceCategories,
  getFinanceCategoryById,
  createFinanceCategory,
  updateFinanceCategory,
  deleteFinanceCategory,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

// Type alias for filter
type GetFinanceCategoriesFilter = {
  type?: FinanceType;
  search?: string;
};

/**
 * Finance Category Repository Prisma Implementation
 *
 * This class implements the IFinanceCategoryRepository interface
 * for Clean Architecture compliance.
 */
export class FinanceCategoryRepositoryPrisma implements IFinanceCategoryRepository {
  /**
   * Get all finance categories
   */
  async findAll(): Promise<FinanceCategory[]> {
    return (await getFinanceCategories({})) as FinanceCategory[];
  }

  /**
   * Get all finance categories with optional filtering and pagination
   */
  async findMany(
    filter?: FinanceCategoryFilter,
    pagination?: FinanceCategoryPagination,
  ): Promise<{
    records: FinanceCategory[];
    pagination: FinanceCategoryPaginationResult;
  }> {
    const filterParam: GetFinanceCategoriesFilter = {};
    if (filter?.type) {
      filterParam.type = filter.type;
    }
    if (filter?.search) {
      filterParam.search = filter.search;
    }
    const records = await getFinanceCategories(filterParam);

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
      records: paginatedRecords as FinanceCategory[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single finance category by ID
   */
  async findById(id: string): Promise<FinanceCategory | null> {
    return (await getFinanceCategoryById(id)) as FinanceCategory | null;
  }

  /**
   * Create a new finance category
   */
  async create(
    data: CreateFinanceCategoryInput,
    user: UserWithId,
  ): Promise<FinanceCategory> {
    return (await createFinanceCategory(data, user)) as FinanceCategory;
  }

  /**
   * Update an existing finance category
   */
  async update(
    id: string,
    data: UpdateFinanceCategoryInput,
  ): Promise<FinanceCategory> {
    const user: UserWithId = { id: "" };
    return (await updateFinanceCategory(id, data, user)) as FinanceCategory;
  }

  /**
   * Delete a finance category
   */
  async delete(id: string): Promise<void> {
    const user: UserWithId = { id: "" };
    await deleteFinanceCategory(id, user);
  }

  /**
   * Count finance categories with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const filterParam: GetFinanceCategoriesFilter = {};
    if (where?.type) {
      filterParam.type = where.type as FinanceType;
    }
    const records = await getFinanceCategories(filterParam);
    return records.length;
  }
}
