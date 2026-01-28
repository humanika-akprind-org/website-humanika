/**
 * Task Department Repository Prisma - Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements ITaskDepartmentRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
  DepartmentTaskFilter,
  UpdateDepartmentTaskInput,
} from "@/domain/entities/task-department.entity";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";
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
 */
export class TaskDepartmentRepositoryPrisma implements ITaskDepartmentRepository {
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
   * Get a single department task by ID
   */
  async getDepartmentTaskById(id: string): Promise<DepartmentTask | null> {
    return (await getDepartmentTask(id)) as DepartmentTask | null;
  }

  /**
   * Create a new department task
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
  async deleteDepartmentTask(id: string, user: UserWithId): Promise<void> {
    await deleteDepartmentTask(id, user);
  }
}
