/**
 * Organization Contact Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IOrganizationContactRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IOrganizationContactRepository,
  OrganizationContactPagination,
  OrganizationContactPaginationResult,
} from "@/application/interface/organization-contact.repository.interface";
import type {
  OrganizationContact,
  CreateOrganizationContactInput,
  UpdateOrganizationContactInput,
  OrganizationContactFilter,
} from "@/domain/entities/organization-contact.entity";
import {
  getOrganizationContacts,
  getOrganizationContact,
  getOrganizationContactByPeriod,
  getActivePeriodOrganizationContact,
  createOrganizationContact,
  updateOrganizationContact,
  deleteOrganizationContact,
} from "./index";

// ============================================================================
// Type Helpers
// ============================================================================

/**
 * Helper function to ensure mission field has the correct type
 * Prisma returns JsonValue which includes null, but our entity expects
 * string | string[] | MissionItem[]
 */
function sanitizeMission(mission: unknown): OrganizationContact["mission"] {
  if (mission === null || mission === undefined) {
    return "";
  }
  return mission as OrganizationContact["mission"];
}

/**
 * Helper function to transform Prisma result to OrganizationContact
 */
function toOrganizationContact(
  data: NonNullable<Awaited<ReturnType<typeof getOrganizationContact>>>,
): OrganizationContact {
  return {
    ...data,
    mission: sanitizeMission(data.mission),
  } as OrganizationContact;
}

/**
 * Organization Contact Repository Prisma Implementation
 *
 * This class implements the IOrganizationContactRepository interface
 * for Clean Architecture compliance.
 */
export class OrganizationContactRepositoryPrisma implements IOrganizationContactRepository {
  /**
   * Get all organization contacts
   */
  async findAll(): Promise<OrganizationContact[]> {
    const organizationContacts = await getOrganizationContacts();

    // Transform results to ensure proper typing
    return organizationContacts.map((contact) =>
      toOrganizationContact(contact as NonNullable<typeof contact>),
    );
  }

  /**
   * Get all organization contacts with optional filtering and pagination
   */
  async findMany(
    filters?: OrganizationContactFilter,
    pagination?: OrganizationContactPagination,
  ): Promise<{
    records: OrganizationContact[];
    pagination: OrganizationContactPaginationResult;
  }> {
    // Get all contacts (the existing function doesn't support pagination)
    const organizationContacts = await getOrganizationContacts(filters);

    // Transform results to ensure proper typing
    const typedContacts = organizationContacts.map((contact) =>
      toOrganizationContact(contact as NonNullable<typeof contact>),
    );

    // Get total count for pagination
    const total = typedContacts.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated organization contacts
    const paginatedContacts = typedContacts.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedContacts,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single organization contact by ID
   */
  async findById(id: string): Promise<OrganizationContact | null> {
    const result = await getOrganizationContact(id);
    if (!result) return null;
    return toOrganizationContact(result);
  }

  /**
   * Get organization contact by period ID
   */
  async findByPeriodId(periodId: string): Promise<OrganizationContact | null> {
    const result = await getOrganizationContactByPeriod(periodId);
    if (!result) return null;
    return toOrganizationContact(result);
  }

  /**
   * Get the active period organization contact
   */
  async findActivePeriod(): Promise<OrganizationContact | null> {
    const result = await getActivePeriodOrganizationContact();
    if (!result) return null;
    return toOrganizationContact(result);
  }

  /**
   * Create a new organization contact
   */
  async create(
    data: CreateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact> {
    // The existing create function expects a user object with id
    const result = await createOrganizationContact(data, {
      id: userId,
    } as { id: string });
    return toOrganizationContact(result);
  }

  /**
   * Update an existing organization contact
   */
  async update(
    id: string,
    data: UpdateOrganizationContactInput,
  ): Promise<OrganizationContact> {
    // The existing update function expects a user object with id
    const result = await updateOrganizationContact(id, data, {
      id: "system",
    } as { id: string });
    return toOrganizationContact(result);
  }

  /**
   * Delete an organization contact
   */
  async delete(id: string, userId: string): Promise<void> {
    // The existing delete function expects a user object with id
    await deleteOrganizationContact(id, { id: userId } as { id: string });
  }

  /**
   * Count organization contacts with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const organizationContacts = await getOrganizationContacts({
      periodId: where?.periodId as string,
    });
    return organizationContacts.length;
  }

  // Aliases for backward compatibility with existing use cases
  async getOrganizationContactById(
    id: string,
  ): Promise<OrganizationContact | null> {
    return this.findById(id);
  }

  async getOrganizationContacts(
    filter?: OrganizationContactFilter,
  ): Promise<OrganizationContact[]> {
    const result = await this.findMany(filter);
    return result.records;
  }

  async createOrganizationContact(
    data: CreateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact> {
    return this.create(data, userId);
  }

  async updateOrganizationContact(
    id: string,
    data: UpdateOrganizationContactInput,
    userId: string,
  ): Promise<OrganizationContact> {
    return this.update(id, data, userId);
  }

  async deleteOrganizationContact(id: string, userId: string): Promise<void> {
    return this.delete(id, userId);
  }
}
