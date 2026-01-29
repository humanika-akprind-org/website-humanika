/**
 * Get Managements Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching managements with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type {
  IManagementRepository,
  ManagementFilters,
  ManagementPagination,
  ManagementPaginationResult,
} from "@/application/interface/management.repository.interface";
import type { Management } from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";

interface ManagementResult {
  records: Management[];
  pagination: ManagementPaginationResult;
}

export class GetManagementsUseCase {
  constructor(private managementRepo: IManagementRepository) {}

  /**
   * Execute the use case to get managements with optional filters and pagination
   *
   * @param filters - Optional filters for querying managements
   * @param pagination - Optional pagination parameters
   * @returns Managements with pagination info
   */
  async execute(
    filters?: ManagementFilters,
    pagination?: ManagementPagination,
  ): Promise<ManagementResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Execute the repository method
    const result = await this.managementRepo.findMany(filters, {
      page,
      limit,
    });

    return {
      records: result.records,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   * Useful for converting URL search params to filters
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<ManagementResult> {
    const filters: ManagementFilters = {
      department: searchParams.has("department")
        ? (searchParams.get("department") as Department)
        : undefined,
      position: searchParams.has("position")
        ? (searchParams.get("position") as Position)
        : undefined,
      periodId: searchParams.get("periodId") || undefined,
      search: searchParams.get("search") || undefined,
      userId: searchParams.get("userId") || undefined,
    };

    const pagination: ManagementPagination = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}
