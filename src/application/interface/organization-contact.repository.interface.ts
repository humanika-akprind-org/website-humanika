import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  OrganizationContact,
  CreateOrganizationContactInput,
  UpdateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/domain/entities/organization-contact.entity";

/**
 * Organization Contact Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines OrganizationContact-specific operations.
 */
export interface IOrganizationContactRepository {
  /** Find all organization contacts */
  findAll(): Promise<OrganizationContact[]>;

  /** Find an organization contact by ID */
  findById(id: string): Promise<OrganizationContact | null>;

  /** Find organization contacts with filters and pagination */
  findMany(
    filters?: OrganizationContactFilter,
    pagination?: BasePagination,
  ): Promise<{
    records: OrganizationContact[];
    pagination: BasePaginationResult;
  }>;

  /** Find organization contact by period ID */
  findByPeriodId(periodId: string): Promise<OrganizationContact | null>;

  /** Find the active period organization contact */
  findActivePeriod(): Promise<OrganizationContact | null>;

  /** Create a new organization contact */
  create(
    data: CreateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact>;

  /** Update an existing organization contact */
  update(
    id: string,
    data: UpdateOrganizationContactInput,
  ): Promise<OrganizationContact>;

  /** Delete an organization contact */
  delete(id: string, userId: string): Promise<void>;

  /** Count organization contacts with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { OrganizationContactFilter };

// Re-export base types with OrganizationContact-specific names for convenience
export type { BasePagination as OrganizationContactPagination };
export type { BasePaginationResult as OrganizationContactPaginationResult };
export type { BaseStats as OrganizationContactStats };
