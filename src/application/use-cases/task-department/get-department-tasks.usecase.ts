import type {
  DepartmentTask,
  DepartmentTaskFilter,
} from "@/domain/entities/task-department.entity";
import type { ITaskDepartmentRepository } from "@/application/interface/task-department.repository.interface";

/**
 * Result type for GetDepartmentTasksUseCase
 */
export interface GetDepartmentTasksResult {
  tasks: DepartmentTask[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Department Tasks Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching department tasks with filtering and pagination.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetDepartmentTasksUseCase {
  constructor(
    private readonly taskDepartmentRepository: ITaskDepartmentRepository,
  ) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for department tasks
   * @returns Promise resolving to filtered tasks with pagination info
   */
  async execute(
    filter?: DepartmentTaskFilter,
  ): Promise<GetDepartmentTasksResult> {
    // Deep validation and sanitization
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const tasks =
      await this.taskDepartmentRepository.getDepartmentTasks(sanitizedFilter);

    // Return structured result with pagination
    return {
      tasks,
      pagination: {
        page: 1,
        limit: 10,
        total: tasks.length,
        totalPages: Math.ceil(tasks.length / 10),
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(
    filter?: DepartmentTaskFilter,
  ): DepartmentTaskFilter | undefined {
    if (!filter) return undefined;

    return {
      department: filter.department,
      status: filter.status,
      userId: filter.userId?.trim() || undefined,
      search: filter.search?.trim() || undefined,
    };
  }
}
