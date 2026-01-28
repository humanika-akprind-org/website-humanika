/**
 * Update Work Program Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating work programs with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  WorkProgram,
  UpdateWorkProgramInput,
} from "@/domain/entities/work-program.entity";
import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Update Work Program Use Case
 * Encapsulates the business logic for updating work programs with validation.
 */
export class UpdateWorkProgramUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param id - Work program ID
   * @param input - Work program update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated work program
   */
  async execute(
    id: string,
    input: UpdateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    // Validate ID
    this.validateId(id);

    // Validate input
    this.validateInput(input);

    // Execute repository call
    const workProgram = await this.workProgramRepository.updateWorkProgram(
      id,
      input,
      user,
    );

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

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateWorkProgramInput): void {
    const errors: string[] = [];

    // Name validation (optional but must be valid if provided)
    if (
      input.name !== undefined &&
      (input.name.trim() === "" || input.name.length < 3)
    ) {
      errors.push("Name must be at least 3 characters if provided");
    }
    if (input.name !== undefined && input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Department validation (optional but must be valid if provided)
    if (input.department !== undefined && !input.department) {
      errors.push("Department is required if provided");
    }

    // Period ID validation (optional but must be valid if provided)
    if (input.periodId !== undefined && input.periodId.trim() === "") {
      errors.push("Period ID cannot be empty if provided");
    }

    // Responsible ID validation (optional but must be valid if provided)
    if (
      input.responsibleId !== undefined &&
      input.responsibleId.trim() === ""
    ) {
      errors.push("Responsible ID cannot be empty if provided");
    }

    // Schedule validation (optional but must be non-empty if provided)
    if (input.schedule !== undefined && input.schedule.trim() === "") {
      errors.push("Schedule cannot be empty if provided");
    }

    // Goal validation (optional but must be non-empty if provided)
    if (input.goal !== undefined && input.goal.trim() === "") {
      errors.push("Goal cannot be empty if provided");
    }

    // Funds validation (optional but must be non-negative if provided)
    if (input.funds !== undefined && input.funds < 0) {
      errors.push("Funds cannot be negative");
    }

    // Used funds validation (optional but must be non-negative if provided)
    if (input.usedFunds !== undefined && input.usedFunds < 0) {
      errors.push("Used funds cannot be negative");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
