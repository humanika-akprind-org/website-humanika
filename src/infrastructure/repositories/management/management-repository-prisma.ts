/**
 * Management Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements IManagementRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IManagementRepository,
  ManagementFilters,
  ManagementPagination,
  ManagementPaginationResult,
} from "@/application/interface/management.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";
import {
  getManagements,
  getManagementById,
  createManagement,
  updateManagement,
  deleteManagement,
  updateManagementPhoto,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Management Repository Prisma Implementation
 *
 * This class implements the IManagementRepository interface
 * for Clean Architecture compliance.
 */
export class ManagementRepositoryPrisma implements IManagementRepository {
  /**
   * Get all management records
   */
  async findAll(): Promise<Management[]> {
    return (await getManagements()) as Management[];
  }

  /**
   * Count management records with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const managements = await getManagements({
      department: where?.department as Department,
      position: where?.position as Position,
      periodId: where?.periodId as string,
      userId: where?.userId as string,
      search: where?.search as string,
    });
    return managements.length;
  }

  /**
   * Create a new management record
   */
  async create(
    data: ManagementServerData,
    userId: string,
  ): Promise<Management> {
    const user: UserWithId = { id: userId };
    return await createManagement(data, user);
  }

  /**
   * Find management by ID
   */
  async findById(id: string): Promise<Management | null> {
    return (await getManagementById(id)) as Management | null;
  }

  /**
   * Find all managements with optional filters and pagination
   */
  async findMany(
    filters?: ManagementFilters,
    pagination?: ManagementPagination,
  ): Promise<{
    records: Management[];
    pagination: ManagementPaginationResult;
  }> {
    const records = await getManagements(filters);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated managements
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as Management[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Update an existing management record
   */
  async update(
    id: string,
    data: ManagementServerData,
    userId: string,
  ): Promise<Management> {
    const user: UserWithId = { id: userId };
    return await updateManagement(id, data, user);
  }

  /**
   * Delete a management record
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteManagement(id, user);
  }

  /**
   * Find management by user ID and period ID
   */
  async findByUserAndPeriod(
    userId: string,
    periodId: string,
  ): Promise<Management | null> {
    const managements = await getManagements({ userId, periodId });
    return (managements[0] || null) as Management | null;
  }

  /**
   * Find management by position and department in a period
   */
  async findByPositionAndDepartment(
    position: Position,
    department: Department,
    periodId: string,
  ): Promise<Management | null> {
    const managements = await getManagements({
      position,
      department,
      periodId,
    });
    return (managements[0] || null) as Management | null;
  }

  /**
   * Update management photo
   */
  async updatePhoto(
    id: string,
    photo: string,
    userId: string,
  ): Promise<Management> {
    const user: UserWithId = { id: userId };
    return await updateManagementPhoto(id, photo, user);
  }
}
