import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";

/**
 * Delete Department Task Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting department tasks with validation and logging.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class DeleteDepartmentTaskUseCase {
  constructor(
    private readonly taskDepartmentRepository: ITaskDepartmentRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The department task ID
   * @param user - User context for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, user: { id: string }): Promise<void> {
    // Validate ID format
    this.validateId(id);

    // Check if task exists
    const existingTask =
      await this.taskDepartmentRepository.getDepartmentTaskById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Execute repository call
    await this.taskDepartmentRepository.deleteDepartmentTask(id, user);
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
