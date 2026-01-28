/**
 * Work Program Repository Interface
 * Part of Clean Architecture: Application Layer (Interface/Port)
 *
 * Defines the contract for work program data access operations.
 * Following Dependency Inversion Principle - high-level modules depend on abstractions.
 */

import type {
  WorkProgram,
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";

// ============================================================================
// Interface Definition
// ============================================================================

export interface IWorkProgramRepository {
  /**
   * Get all work programs with optional filters
   */
  getWorkPrograms(filter?: WorkProgramFilter): Promise<WorkProgram[]>;

  /**
   * Get a single work program by its ID
   */
  getWorkProgramById(id: string): Promise<WorkProgram | null>;

  /**
   * Create a new work program
   */
  createWorkProgram(
    data: CreateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram>;

  /**
   * Update an existing work program
   */
  updateWorkProgram(
    id: string,
    data: UpdateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram>;

  /**
   * Delete a single work program by its ID
   */
  deleteWorkProgram(id: string, user: { id: string }): Promise<void>;

  /**
   * Delete multiple work programs by their IDs
   */
  bulkDeleteWorkPrograms(
    ids: string[],
    user: { id: string },
  ): Promise<{ count: number }>;
}

// ============================================================================
// Type Aliases for Use Cases (optional - for convenience)
// ============================================================================

export type { WorkProgramFilter } from "@/domain/entities/work-program.entity";
export type {
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/domain/entities/work-program.entity";
