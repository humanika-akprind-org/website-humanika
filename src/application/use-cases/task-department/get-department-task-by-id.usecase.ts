import type { DepartmentTask } from "@/domain/entities/task-department.entity";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";

/**
 * Get Department Task By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single department task by ID.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetDepartmentTaskByIdUseCase {
  constructor(
    private readonly taskDepartmentRepository: ITaskDepartmentRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The department task ID
   * @returns Promise resolving to the department task
   */
  async execute(id: string): Promise<DepartmentTask> {
    // Validate ID format
    this.validateId(id);

    // Execute repository call
    const departmentTask =
      await this.taskDepartmentRepository.getDepartmentTaskById(id);

    // Handle not found case
    if (!departmentTask) {
      throw new Error("Task not found");
    }

    return departmentTask;
  }

  /**
   * Validate ID format
   * @throws Error if validation fails
   */
  private validateId(id: string): void {
    if (!id || id.trim() === "") {
      throw new Error("Task ID is required");
    }

    // Basic ID format validation (UUID-like)
    if (!/^[a-zA-Z0-9-]+$/.test(id)) {
      throw new Error("Invalid ID format");
    }
  }
}
