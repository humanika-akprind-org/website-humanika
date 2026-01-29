/**
 * Get Organization Contacts Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching organization contacts with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type { BasePagination } from "@/application/interface/base.repository.interface";
import type {
  IOrganizationContactRepository,
  OrganizationContactPaginationResult,
} from "@/application/interface/organization-contact.repository.interface";
import type {
  OrganizationContact,
  OrganizationContactFilter,
} from "@/domain/entities/organization-contact.entity";

interface OrganizationContactResult {
  records: OrganizationContact[];
  pagination: OrganizationContactPaginationResult;
}

export class GetOrganizationContactsUseCase {
  constructor(
    private organizationContactRepo: IOrganizationContactRepository,
  ) {}

  /**
   * Execute the use case to get organization contacts with optional filters and pagination
   *
   * @param filters - Optional filters for querying organization contacts
   * @param pagination - Optional pagination parameters
   * @returns Organization contacts with pagination info
   */
  async execute(
    filters?: OrganizationContactFilter,
    pagination?: BasePagination,
  ): Promise<OrganizationContactResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Handle special period=active query
    if (filters?.period === "active") {
      const activeContact =
        await this.organizationContactRepo.findActivePeriod();
      return {
        records: activeContact ? [activeContact] : [],
        pagination: {
          page: 1,
          limit: 1,
          total: activeContact ? 1 : 0,
          totalPages: 1,
        },
      };
    }

    // Execute the repository method
    const result = await this.organizationContactRepo.findMany(filters, {
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
  ): Promise<OrganizationContactResult> {
    const filters: OrganizationContactFilter = {
      periodId: searchParams.get("periodId") || undefined,
      period: searchParams.get("period") || undefined,
    };

    const pagination: BasePagination = {
      page: parseInt(searchParams.get("page") || "1", 10) || undefined,
      limit: parseInt(searchParams.get("limit") || "10", 10) || undefined,
    };

    return this.execute(filters, pagination);
  }
}
