import type {
  CreateDepartmentTaskInput,
  DepartmentTask,
} from "@/domain/entities/task-department.entity";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";

/**
 * Update Department Task Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating department tasks with validation and logging.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class UpdateDepartmentTaskUseCase {
  constructor(
    private readonly taskDepartmentRepository: ITaskDepartmentRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - The department task ID
   * @param input - Department task update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated department task
   */
  async execute(
    id: string,
    input: Partial<CreateDepartmentTaskInput>,
    user: { id: string },
  ): Promise<DepartmentTask> {
    // Validate input
    this.validateInput(input);

    // Check if task exists
    const existingTask =
      await this.taskDepartmentRepository.getDepartmentTaskById(id);
    if (!existingTask) {
      throw new Error("Task not found");
    }

    // Execute repository call
    const departmentTask =
      await this.taskDepartmentRepository.updateDepartmentTask(id, input, user);

    return departmentTask;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: Partial<CreateDepartmentTaskInput>): void {
    const errors: string[] = [];

    // Title validation (if provided)
    if (input.title !== undefined) {
      if (input.title.trim() === "") {
        errors.push("Title cannot be empty");
      } else if (input.title.length < 3) {
        errors.push("Title must be at least 3 characters");
      } else if (input.title.length > 255) {
        errors.push("Title must be less than 255 characters");
      }
    }

    // Note validation (if provided)
    if (input.note !== undefined && input.note.trim() === "") {
      errors.push("Note cannot be empty");
    }

    // At least one field must be provided
    if (
      input.title === undefined &&
      input.note === undefined &&
      input.department === undefined &&
      input.userId === undefined &&
      input.workProgramId === undefined &&
      input.status === undefined
    ) {
      errors.push("At least one field is required");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
