/**
 * Organizational Structure Repository Prisma - Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements IOrganizationalStructureRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  OrganizationalStructure,
  OrganizationalStructureFilter,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";
import type { IOrganizationalStructureRepository } from "@/application/interface/organizational-structure.repository.interface";
import {
  getStructures,
  getStructure,
  createStructure,
  updateStructure,
  deleteStructure,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Organizational Structure Repository Prisma Implementation
 */
export class OrganizationalStructureRepositoryPrisma implements IOrganizationalStructureRepository {
  /**
   * Get all organizational structures with optional filters
   */
  async getStructures(
    filter?: OrganizationalStructureFilter,
  ): Promise<OrganizationalStructure[]> {
    return await getStructures({
      status: filter?.status,
      periodId: filter?.periodId,
      search: filter?.search,
    });
  }

  /**
   * Get a single organizational structure by ID
   */
  async getStructureById(id: string): Promise<OrganizationalStructure> {
    return await getStructure(id);
  }

  /**
   * Create a new organizational structure
   */
  async createStructure(
    data: CreateOrganizationalStructureInput,
    user: UserWithId,
  ): Promise<OrganizationalStructure> {
    return await createStructure(data, user);
  }

  /**
   * Update an existing organizational structure
   */
  async updateStructure(
    id: string,
    data: UpdateOrganizationalStructureInput,
    user: UserWithId,
  ): Promise<OrganizationalStructure> {
    return await updateStructure(id, data, user);
  }

  /**
   * Delete an organizational structure
   */
  async deleteStructure(id: string, user: UserWithId): Promise<void> {
    await deleteStructure(id, user);
  }
}
