/**
 * Update Finance Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating finance categories
 * with comprehensive validation and logging.
 */

import type {
  UpdateFinanceCategoryInput,
  FinanceCategory,
} from "@/domain/value-objects/finance-category";

/**
 * Repository interface for finance category write operations
 */
export interface IFinanceCategoryRepository {
  getFinanceCategoryById(id: string): Promise<FinanceCategory | null>;
  updateFinanceCategory(
    id: string,
    data: UpdateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory>;
}

/**
 * Update Finance Category Use Case
 */
export class UpdateFinanceCategoryUseCase {
  constructor(
    private readonly financeCategoryRepository: IFinanceCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Finance category ID
   * @param input - Update input data
   * @param user - User context for logging
   * @returns Promise resolving to updated finance category
   */
  async execute(
    id: string,
    input: UpdateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory> {
    // Validate input with detailed error messages
    this.validateInput(input);

    // Check if category exists
    const existing =
      await this.financeCategoryRepository.getFinanceCategoryById(id);
    if (!existing) {
      throw new Error("Finance category not found");
    }

    // Execute repository call with user context
    const financeCategory =
      await this.financeCategoryRepository.updateFinanceCategory(
        id,
        input,
        user,
      );

    return financeCategory;
  }

  /**
   * Validate input data with comprehensive checks
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateFinanceCategoryInput): void {
    const errors: string[] = [];

    // Name validation (optional but if provided must be valid)
    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty");
    } else if (input.name && input.name.length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (input.name && input.name.length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    // Description validation (optional but if provided must be valid)
    if (input.description !== undefined && input.description.trim() === "") {
      errors.push("Description cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
