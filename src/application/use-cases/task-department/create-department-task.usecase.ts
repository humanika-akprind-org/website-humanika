import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
} from "@/domain/entities/task-department.entity";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";

/**
 * Create Department Task Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating department tasks with validation and logging.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class CreateDepartmentTaskUseCase {
  constructor(
    private readonly taskDepartmentRepository: ITaskDepartmentRepository,
  ) {}

  /**
   * Execute the use case
   * @param input - Department task creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created department task
   */
  async execute(
    input: CreateDepartmentTaskInput,
    user: { id: string },
  ): Promise<DepartmentTask> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const departmentTask =
      await this.taskDepartmentRepository.createDepartmentTask(input, user);

    return departmentTask;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateDepartmentTaskInput): void {
    const errors: string[] = [];

    // Title validation
    if (!input.title || input.title.trim() === "") {
      errors.push("Title is required");
    } else if (input.title.length < 3) {
      errors.push("Title must be at least 3 characters");
    } else if (input.title.length > 255) {
      errors.push("Title must be less than 255 characters");
    }

    // Note validation
    if (!input.note || input.note.trim() === "") {
      errors.push("Note is required");
    }

    // Department validation
    if (!input.department) {
      errors.push("Department is required");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
