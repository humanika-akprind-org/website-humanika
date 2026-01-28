/**
 * Organization Contact Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository wraps existing organization contact functions
 * and implements the IOrganizationContactRepository interface.
 */

import type {
  IOrganizationContactRepository,
  OrganizationContactPaginationInput,
  OrganizationContactResult,
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
 * This class wraps existing repository functions to implement
 * the standardized repository interface for Clean Architecture.
 */
export class OrganizationContactRepositoryPrisma implements IOrganizationContactRepository {
  /**
   * Get all organization contacts with optional filtering and pagination
   */
  async findMany(
    filter?: OrganizationContactFilter,
    pagination?: OrganizationContactPaginationInput,
  ): Promise<OrganizationContactResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Get all contacts (the existing function doesn't support pagination)
    const organizationContacts = await getOrganizationContacts(filter);

    // Transform results to ensure proper typing
    const typedContacts = organizationContacts.map((contact) =>
      toOrganizationContact(contact as NonNullable<typeof contact>),
    );

    // Calculate pagination metadata
    const total = typedContacts.length;
    const totalPages = Math.ceil(total / limit);
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;

    // Apply pagination to results
    const paginatedContacts = typedContacts.slice(startIndex, endIndex);

    return {
      organizationContacts: paginatedContacts,
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
    userId: string,
  ): Promise<OrganizationContact> {
    // The existing update function expects a user object with id
    const result = await updateOrganizationContact(id, data, {
      id: userId,
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
}
