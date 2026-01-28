/**
 * Organization Contact Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for organization contact data operations.
 * All repository implementations must implement these methods.
 */

import type {
  OrganizationContact,
  CreateOrganizationContactInput,
  UpdateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/domain/entities/organization-contact.entity";

// ============================================================================
// Pagination Types
// ============================================================================

/**
 * Pagination input parameters (only includes controllable fields)
 */
export interface OrganizationContactPaginationInput {
  page?: number;
  limit?: number;
}

/**
 * Pagination output result (includes computed fields)
 */
export interface OrganizationContactPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface OrganizationContactResult {
  organizationContacts: OrganizationContact[];
  pagination: OrganizationContactPaginationResult;
}

// ============================================================================
// Repository Interface
// ============================================================================

export interface IOrganizationContactRepository {
  /**
   * Get all organization contacts with optional filtering
   *
   * @param filter - Optional filter criteria
   * @param pagination - Optional pagination parameters
   * @returns Paginated organization contacts
   */
  findMany(
    filter?: OrganizationContactFilter,
    pagination?: OrganizationContactPaginationInput,
  ): Promise<OrganizationContactResult>;

  /**
   * Get a single organization contact by ID
   *
   * @param id - Organization contact ID
   * @returns The organization contact or null if not found
   */
  findById(id: string): Promise<OrganizationContact | null>;

  /**
   * Get organization contact by period ID
   *
   * @param periodId - Period ID
   * @returns The organization contact or null if not found
   */
  findByPeriodId(periodId: string): Promise<OrganizationContact | null>;

  /**
   * Get the active period organization contact
   *
   * @returns The active period organization contact or null if not found
   */
  findActivePeriod(): Promise<OrganizationContact | null>;

  /**
   * Create a new organization contact
   *
   * @param data - Organization contact data
   * @param userId - ID of the user creating the contact
   * @returns The created organization contact
   */
  create(
    data: CreateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact>;

  /**
   * Update an existing organization contact
   *
   * @param id - Organization contact ID
   * @param data - Update data
   * @param userId - ID of the user updating the contact
   * @returns The updated organization contact
   */
  update(
    id: string,
    data: UpdateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact>;

  /**
   * Delete an organization contact
   *
   * @param id - Organization contact ID
   * @param userId - ID of the user deleting the contact
   */
  delete(id: string, userId: string): Promise<void>;
}
