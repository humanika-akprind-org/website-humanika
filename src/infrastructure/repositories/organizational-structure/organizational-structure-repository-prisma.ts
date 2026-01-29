/**
 * Organizational Structure Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IOrganizationalStructureRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IOrganizationalStructureRepository,
  OrganizationalStructurePagination,
  OrganizationalStructurePaginationResult,
} from "@/application/interface/organizational-structure.repository.interface";
import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";
import {
  getStructures,
  getStructure,
  createStructure,
  updateStructure,
  deleteStructure,
} from "./index";
import { type Status } from "@/domain/enums";

/**
 * Organizational Structure Repository Prisma Implementation
 *
 * This class implements the IOrganizationalStructureRepository interface
 * for Clean Architecture compliance.
 */
export class OrganizationalStructureRepositoryPrisma implements IOrganizationalStructureRepository {
  /**
   * Get all organizational structures
   */
  async findAll(): Promise<OrganizationalStructure[]> {
    return await getStructures({});
  }

  /**
   * Get all organizational structures with optional filtering and pagination
   */
  async findMany(
    filters?: OrganizationalStructureFilter,
    pagination?: OrganizationalStructurePagination,
  ): Promise<{
    records: OrganizationalStructure[];
    pagination: OrganizationalStructurePaginationResult;
  }> {
    const records = await getStructures({
      status: filters?.status,
      periodId: filters?.periodId,
      search: filters?.search,
    });

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated organizational structures
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as OrganizationalStructure[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single organizational structure by ID
   */
  async findById(id: string): Promise<OrganizationalStructure | null> {
    return await getStructure(id);
  }

  /**
   * Create a new organizational structure
   */
  async create(
    data: CreateOrganizationalStructureInput,
    user: { id: string },
  ): Promise<OrganizationalStructure> {
    return await createStructure(data, user);
  }

  /**
   * Update an existing organizational structure
   */
  async update(
    id: string,
    data: UpdateOrganizationalStructureInput,
  ): Promise<OrganizationalStructure> {
    return await updateStructure(id, data, { id: "system" }); // Assuming system user for updates without user context
  }

  /**
   * Delete an organizational structure
   */
  async delete(id: string): Promise<void> {
    await deleteStructure(id, { id: "system" }); // Assuming system user for deletes
  }

  /**
   * Count organizational structures with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const structures = await getStructures({
      status: where?.status as Status,
      periodId: where?.periodId as string,
      search: where?.search as string,
    });
    return structures.length;
  }
}
