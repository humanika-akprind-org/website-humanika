/**
 * Task Department Repository Prisma - Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements ITaskDepartmentRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  ITaskDepartmentRepository,
  DepartmentTaskPagination,
  DepartmentTaskPaginationResult,
} from "@/application/interface/task-department.repository.interface";
import type {
  DepartmentTask,
  DepartmentTaskFilter,
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/domain/entities/task-department.entity";
import type { Department, Status } from "@/domain/enums";
import {
  getDepartmentTasks,
  getDepartmentTask,
  createDepartmentTask,
  updateDepartmentTask,
  deleteDepartmentTask,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Task Department Repository Prisma Implementation
 *
 * This class implements the ITaskDepartmentRepository interface
 * for Clean Architecture compliance.
 */
export class TaskDepartmentRepositoryPrisma implements ITaskDepartmentRepository {
  /**
   * Get all department tasks
   */
  async findAll(): Promise<DepartmentTask[]> {
    return (await getDepartmentTasks({})) as DepartmentTask[];
  }

  /**
   * Get all department tasks with optional filtering and pagination
   */
  async findMany(
    filter?: DepartmentTaskFilter,
    pagination?: DepartmentTaskPagination,
  ): Promise<{
    records: DepartmentTask[];
    pagination: DepartmentTaskPaginationResult;
  }> {
    const records = await getDepartmentTasks({
      department: filter?.department,
      status: filter?.status,
      userId: filter?.userId,
      search: filter?.search,
    });

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated department tasks
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as DepartmentTask[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single department task by ID
   */
  async findById(id: string): Promise<DepartmentTask | null> {
    return (await getDepartmentTask(id)) as DepartmentTask | null;
  }

  /**
   * Get a department task by ID (legacy method for backward compatibility)
   */
  async getDepartmentTaskById(id: string): Promise<DepartmentTask | null> {
    return (await getDepartmentTask(id)) as DepartmentTask | null;
  }

  /**
   * Get all department tasks with optional filters
   */
  async getDepartmentTasks(
    filter?: DepartmentTaskFilter,
  ): Promise<DepartmentTask[]> {
    return await getDepartmentTasks({
      department: filter?.department,
      status: filter?.status,
      userId: filter?.userId,
      search: filter?.search,
    });
  }

  /**
   * Create a new department task
   */
  async create(
    data: CreateDepartmentTaskInput,
    user: UserWithId,
  ): Promise<DepartmentTask> {
    return await createDepartmentTask(data, user);
  }

  /**
   * Create a new department task (legacy method for backward compatibility)
   */
  async createDepartmentTask(
    data: CreateDepartmentTaskInput,
    user: UserWithId,
  ): Promise<DepartmentTask> {
    return await createDepartmentTask(data, user);
  }

  /**
   * Update an existing department task
   */
  async update(
    id: string,
    data: Partial<CreateDepartmentTaskInput>,
  ): Promise<DepartmentTask> {
    const user: UserWithId = { id: "" };
    return await updateDepartmentTask(
      id,
      data as UpdateDepartmentTaskInput,
      user,
    );
  }

  /**
   * Update an existing department task (legacy method for backward compatibility)
   */
  async updateDepartmentTask(
    id: string,
    data: UpdateDepartmentTaskInput,
    user: UserWithId,
  ): Promise<DepartmentTask> {
    return await updateDepartmentTask(id, data, user);
  }

  /**
   * Delete a department task
   */
  async delete(id: string): Promise<void> {
    const user: UserWithId = { id: "" };
    await deleteDepartmentTask(id, user);
  }

  /**
   * Delete a department task (legacy method for backward compatibility)
   */
  async deleteDepartmentTask(id: string, user: UserWithId): Promise<void> {
    await deleteDepartmentTask(id, user);
  }

  /**
   * Count department tasks with optional filter
   */
  async count(where?: Record<string, unknown>): Promise<number> {
    const tasks = await getDepartmentTasks({
      department: where?.department as Department | undefined,
      status: where?.status as Status | undefined,
      userId: where?.userId as string | undefined,
      search: where?.search as string | undefined,
    });
    return tasks.length;
  }
}
