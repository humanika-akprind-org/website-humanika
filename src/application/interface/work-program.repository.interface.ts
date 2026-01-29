import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";

/**
 * Work Program Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines WorkProgram-specific operations.
 */
export interface IWorkProgramRepository {
  /** Find all work programs */
  findAll(): Promise<WorkProgram[]>;

  /** Find a work program by ID */
  findById(id: string): Promise<WorkProgram | null>;

  /** Find work programs with filters and pagination */
  findMany(
    filters?: WorkProgramFilter,
    pagination?: BasePagination,
  ): Promise<{ records: WorkProgram[]; pagination: BasePaginationResult }>;

  /** Create a new work program */
  create(
    data: CreateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram>;

  /** Update an existing work program */
  update(id: string, data: UpdateWorkProgramInput): Promise<WorkProgram>;

  /** Delete a work program */
  delete(id: string): Promise<void>;

  /** Count work programs with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { WorkProgramFilter };

// Re-export base types with WorkProgram-specific names for convenience
export type { BasePagination as WorkProgramPagination };
export type { BasePaginationResult as WorkProgramPaginationResult };
export type { BaseStats as WorkProgramStats };
