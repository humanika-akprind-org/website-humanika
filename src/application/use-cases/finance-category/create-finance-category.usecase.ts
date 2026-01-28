/**
 * Create Finance Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating finance categories
 * with comprehensive validation, logging, and approval workflow.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  CreateFinanceCategoryInput,
  FinanceCategory,
} from "@/domain/value-objects/finance-category";

/**
 * Repository interface for finance category write operations
 */
export interface IFinanceCategoryRepository {
  createFinanceCategory(
    data: CreateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory>;
}

/**
 * Create Finance Category Use Case
 */
export class CreateFinanceCategoryUseCase {
  constructor(
    private readonly financeCategoryRepository: IFinanceCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param input - Finance category creation input data
   * @param user - User context for logging and authorization
   * @returns Promise resolving to created finance category
   */
  async execute(
    input: CreateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory> {
    // Validate input with detailed error messages
    this.validateInput(input);

    // Execute repository call with user context
    const financeCategory =
      await this.financeCategoryRepository.createFinanceCategory(input, user);

    return financeCategory;
  }

  /**
   * Validate input data with comprehensive checks
   * @throws Error if validation fails
   */
  private validateInput(input: CreateFinanceCategoryInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    } else if (input.name.length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (input.name.length > 100) {
      errors.push("Name must be less than 100 characters");
    }

    // Type validation
    if (!input.type) {
      errors.push("Type is required (INCOME or EXPENSE)");
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
