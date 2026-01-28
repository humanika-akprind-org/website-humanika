/**
 * Get Work Programs Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching work programs with filtering.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  WorkProgram,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";
import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Result type for GetWorkProgramsUseCase
 */
export interface GetWorkProgramsResult {
  workPrograms: WorkProgram[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

/**
 * Get Work Programs Use Case
 * Encapsulates the business logic for fetching work programs with filtering and pagination.
 */
export class GetWorkProgramsUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for work programs
   * @returns Promise resolving to filtered work programs with pagination info
   */
  async execute(filter?: WorkProgramFilter): Promise<GetWorkProgramsResult> {
    // Sanitize and validate filter parameters
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const workPrograms =
      await this.workProgramRepository.getWorkPrograms(sanitizedFilter);

    // Return structured result with pagination
    return {
      workPrograms,
      pagination: {
        page: 1,
        limit: 10,
        total: workPrograms.length,
        totalPages: Math.ceil(workPrograms.length / 10),
      },
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(
    filter?: WorkProgramFilter,
  ): WorkProgramFilter | undefined {
    if (!filter) return undefined;

    return {
      department: filter.department,
      status: filter.status,
      periodId: filter.periodId?.trim() || undefined,
      search: filter.search?.trim() || undefined,
    };
  }
}
