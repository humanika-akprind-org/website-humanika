/**
 * Get Work Program By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single work program by ID.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { WorkProgram } from "@/domain/entities/work-program.entity";
import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Get Work Program By ID Use Case
 * Encapsulates the business logic for fetching a single work program by ID.
 */
export class GetWorkProgramByIdUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param id - Work program ID
   * @returns Promise resolving to work program or null if not found
   */
  async execute(id: string): Promise<WorkProgram | null> {
    // Validate ID
    this.validateId(id);

    // Execute repository call
    const workProgram = await this.workProgramRepository.getWorkProgramById(id);

    return workProgram;
  }

  /**
   * Validate ID parameter
   */
  private validateId(id: string): void {
    if (!id || id === "undefined" || id.trim() === "") {
      throw new Error("Invalid work program ID");
    }
  }
}
