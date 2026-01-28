/**
 * Delete Work Program Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting a single work program.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Delete Work Program Use Case
 * Encapsulates the business logic for deleting a single work program with validation.
 */
export class DeleteWorkProgramUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param id - Work program ID to delete
   * @param user - User context for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, user: { id: string }): Promise<void> {
    // Validate ID
    this.validateId(id);

    // Execute repository call
    await this.workProgramRepository.deleteWorkProgram(id, user);
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
