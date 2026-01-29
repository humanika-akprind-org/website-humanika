/**
 * Work Program Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IWorkProgramRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IWorkProgramRepository,
  WorkProgramPagination,
  WorkProgramPaginationResult,
} from "@/application/interface/work-program.repository.interface";
import type {
  WorkProgram,
  WorkProgramFilter,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/domain/entities/work-program.entity";
import type { Department, Status } from "@/domain/enums";
import {
  getWorkPrograms,
  getWorkProgram,
  createWorkProgram,
  updateWorkProgram,
  deleteWorkProgram,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Work Program Repository Prisma Implementation
 *
 * This class implements the IWorkProgramRepository interface
 * for Clean Architecture compliance.
 */
export class WorkProgramRepositoryPrisma implements IWorkProgramRepository {
  /**
   * Get all work programs
   */
  async findAll(): Promise<WorkProgram[]> {
    return (await getWorkPrograms({})) as WorkProgram[];
  }

  /**
   * Get all work programs with optional filtering and pagination
   */
  async findMany(
    filter?: WorkProgramFilter,
    pagination?: WorkProgramPagination,
  ): Promise<{
    records: WorkProgram[];
    pagination: WorkProgramPaginationResult;
  }> {
    const records = await getWorkPrograms({
      department: filter?.department,
      status: filter?.status,
      search: filter?.search,
      periodId: filter?.periodId,
    });

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated work programs
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as WorkProgram[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single work program by ID
   */
  async findById(id: string): Promise<WorkProgram | null> {
    return (await getWorkProgram(id)) as WorkProgram | null;
  }

  /**
   * Get a work program by ID (legacy method for backward compatibility)
   */
  async getWorkProgramById(id: string): Promise<WorkProgram | null> {
    return (await getWorkProgram(id)) as WorkProgram | null;
  }

  /**
   * Get all work programs with optional filters
   */
  async getWorkPrograms(filter?: WorkProgramFilter): Promise<WorkProgram[]> {
    return (await getWorkPrograms({
      department: filter?.department,
      status: filter?.status,
      search: filter?.search,
      periodId: filter?.periodId,
    })) as WorkProgram[];
  }

  /**
   * Create a new work program
   */
  async create(
    data: CreateWorkProgramInput,
    user: UserWithId,
  ): Promise<WorkProgram> {
    return await createWorkProgram(data, user);
  }

  /**
   * Create a new work program (legacy method for backward compatibility)
   */
  async createWorkProgram(
    data: CreateWorkProgramInput,
    user: UserWithId,
  ): Promise<WorkProgram> {
    return await createWorkProgram(data, user);
  }

  /**
   * Update an existing work program
   */
  async update(id: string, data: UpdateWorkProgramInput): Promise<WorkProgram> {
    const user: UserWithId = { id: "" };
    return await updateWorkProgram(id, data, user);
  }

  /**
   * Update an existing work program (legacy method for backward compatibility)
   */
  async updateWorkProgram(
    id: string,
    data: UpdateWorkProgramInput,
    user: UserWithId,
  ): Promise<WorkProgram> {
    return await updateWorkProgram(id, data, user);
  }

  /**
   * Delete a work program
   */
  async delete(id: string): Promise<void> {
    const user: UserWithId = { id: "" };
    await deleteWorkProgram(id, user);
  }

  /**
   * Delete a work program (legacy method for backward compatibility)
   */
  async deleteWorkProgram(id: string, user: UserWithId): Promise<void> {
    await deleteWorkProgram(id, user);
  }

  /**
   * Count work programs with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const workPrograms = await getWorkPrograms({
      department: where?.department as Department | undefined,
      status: where?.status as Status | undefined,
      search: where?.search as string | undefined,
      periodId: where?.periodId as string | undefined,
    });
    return workPrograms.length;
  }
}
