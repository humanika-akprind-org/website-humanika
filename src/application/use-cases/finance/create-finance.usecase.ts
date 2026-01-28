import type {
  CreateFinanceInput,
  Finance,
} from "@/domain/entities/finance.entity";
import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";

/**
 * Create Finance Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating finances with validation and logging.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class CreateFinanceUseCase {
  constructor(private readonly financeRepository: IFinanceRepository) {}

  /**
   * Execute the use case
   * @param input - Finance creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created finance
   */
  async execute(
    input: CreateFinanceInput,
    user: { id: string },
  ): Promise<Finance> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const finance = await this.financeRepository.createFinance(input, user);

    return finance;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateFinanceInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    } else if (input.name.length < 3) {
      errors.push("Name must be at least 3 characters");
    } else if (input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Amount validation
    if (!input.amount || typeof input.amount !== "number") {
      errors.push("Amount is required and must be a number");
    } else if (input.amount <= 0) {
      errors.push("Amount must be greater than 0");
    }

    // Date validation
    if (!input.date) {
      errors.push("Date is required");
    }

    // Type validation
    if (!input.type) {
      errors.push("Type is required");
    }

    // Category ID validation (optional but if provided must be valid)
    if (input.categoryId && input.categoryId.trim() === "") {
      errors.push("Category ID cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
