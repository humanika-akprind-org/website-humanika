import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
  DepartmentTaskFilter,
} from "@/domain/entities/task-department.entity";

/**
 * Task Department Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines TaskDepartment-specific operations.
 */
export interface ITaskDepartmentRepository {
  /** Find all department tasks */
  findAll(): Promise<DepartmentTask[]>;

  /** Find a department task by ID */
  findById(id: string): Promise<DepartmentTask | null>;

  /** Find department tasks with filters and pagination */
  findMany(
    filters?: DepartmentTaskFilter,
    pagination?: BasePagination,
  ): Promise<{ records: DepartmentTask[]; pagination: BasePaginationResult }>;

  /** Create a new department task */
  create(
    data: CreateDepartmentTaskInput,
    user: { id: string },
  ): Promise<DepartmentTask>;

  /** Update an existing department task */
  update(
    id: string,
    data: Partial<CreateDepartmentTaskInput>,
  ): Promise<DepartmentTask>;

  /** Delete a department task */
  delete(id: string): Promise<void>;

  /** Count department tasks with optional filter */
  count(where?: BaseFilter): Promise<number>;

  // Aliases for backward compatibility with existing use cases
  getDepartmentTaskById(id: string): Promise<DepartmentTask | null>;
  getDepartmentTasks(filter?: DepartmentTaskFilter): Promise<DepartmentTask[]>;
  createDepartmentTask(
    data: CreateDepartmentTaskInput,
    user: { id: string },
  ): Promise<DepartmentTask>;
  updateDepartmentTask(
    id: string,
    data: Partial<CreateDepartmentTaskInput>,
    user: { id: string },
  ): Promise<DepartmentTask>;
  deleteDepartmentTask(id: string, user: { id: string }): Promise<void>;
}

// Re-export for convenience
export type { DepartmentTaskFilter };

// Re-export base types with DepartmentTask-specific names for convenience
export type { BasePagination as DepartmentTaskPagination };
export type { BasePaginationResult as DepartmentTaskPaginationResult };
export type { BaseStats as DepartmentTaskStats };
