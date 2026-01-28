/**
 * Create Work Program Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating work programs with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  WorkProgram,
  CreateWorkProgramInput,
} from "@/domain/entities/work-program.entity";
import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Create Work Program Use Case
 * Encapsulates the business logic for creating work programs with validation, logging, and approval workflow.
 */
export class CreateWorkProgramUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param input - Work program creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created work program
   */
  async execute(
    input: CreateWorkProgramInput,
    user: { id: string },
  ): Promise<WorkProgram> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const workProgram = await this.workProgramRepository.createWorkProgram(
      input,
      user,
    );

    return workProgram;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateWorkProgramInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    } else if (input.name.length < 3) {
      errors.push("Name must be at least 3 characters");
    } else if (input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Department validation
    if (!input.department) {
      errors.push("Department is required");
    }

    // Period ID validation
    if (!input.periodId || input.periodId.trim() === "") {
      errors.push("Period ID is required");
    }

    // Responsible ID validation
    if (!input.responsibleId || input.responsibleId.trim() === "") {
      errors.push("Responsible ID is required");
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
