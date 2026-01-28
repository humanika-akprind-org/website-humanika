import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
  DepartmentTaskFilter,
} from "@/domain/entities/task-department.entity";

/**
 * Task Department Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for task department data access operations.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */
export interface ITaskDepartmentRepository {
  /**
   * Get all department tasks with optional filters
   */
  getDepartmentTasks(filter?: DepartmentTaskFilter): Promise<DepartmentTask[]>;

  /**
   * Get a single department task by ID
   */
  getDepartmentTaskById(id: string): Promise<DepartmentTask | null>;

  /**
   * Create a new department task
   */
  createDepartmentTask(
    data: CreateDepartmentTaskInput,
    user: { id: string },
  ): Promise<DepartmentTask>;

  /**
   * Update an existing department task
   */
  updateDepartmentTask(
    id: string,
    data: Partial<CreateDepartmentTaskInput>,
    user: { id: string },
  ): Promise<DepartmentTask>;

  /**
   * Delete a department task
   */
  deleteDepartmentTask(id: string, user: { id: string }): Promise<void>;
}
