import type {
  UpdateFinanceInput,
  Finance,
} from "@/domain/entities/finance.entity";
import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";

/**
 * Update Finance Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating finances with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class UpdateFinanceUseCase {
  constructor(private readonly financeRepository: IFinanceRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the finance to update
   * @param input - Finance update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated finance
   */
  async execute(
    id: string,
    input: UpdateFinanceInput,
    _user: { id: string },
  ): Promise<Finance> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Finance ID is required");
    }

    // Validate input
    this.validateInput(input);

    // Execute repository call
    const finance = await this.financeRepository.updateFinance(
      id.trim(),
      input,
    );

    return finance;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateFinanceInput): void {
    const errors: string[] = [];

    // Name validation (optional but if provided must be valid)
    if (input.name !== undefined) {
      if (input.name.trim() === "") {
        errors.push("Name cannot be empty if provided");
      } else if (input.name.length < 3) {
        errors.push("Name must be at least 3 characters");
      } else if (input.name.length > 255) {
        errors.push("Name must be less than 255 characters");
      }
    }

    // Amount validation (optional but if provided must be valid)
    if (input.amount !== undefined) {
      if (typeof input.amount !== "number") {
        errors.push("Amount must be a number");
      } else if (input.amount <= 0) {
        errors.push("Amount must be greater than 0");
      }
    }

    // Category ID validation (optional but if provided must be valid)
    if (
      input.categoryId !== undefined &&
      input.categoryId !== null &&
      input.categoryId.trim() === ""
    ) {
      errors.push("Category ID cannot be empty if provided");
    }

    // Work Program ID validation (optional but if provided must be valid)
    if (
      input.workProgramId !== undefined &&
      input.workProgramId !== null &&
      input.workProgramId.trim() === ""
    ) {
      errors.push("Work Program ID cannot be empty if provided");
    }

    // Period ID validation (optional but if provided must be valid)
    if (
      input.periodId !== undefined &&
      input.periodId !== null &&
      input.periodId.trim() === ""
    ) {
      errors.push("Period ID cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
