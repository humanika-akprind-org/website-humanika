import type { Finance } from "@/domain/entities/finance.entity";
import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";

/**
 * Get Finance By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single finance by its ID.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetFinanceByIdUseCase {
  constructor(private readonly financeRepository: IFinanceRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the finance to fetch
   * @returns Promise resolving to the finance or null if not found
   */
  async execute(id: string): Promise<Finance | null> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Finance ID is required");
    }

    // Sanitize ID
    const sanitizedId = id.trim();

    // Execute repository call
    const finance = await this.financeRepository.getFinanceById(sanitizedId);

    // Throw error if finance not found
    if (!finance) {
      throw new Error("Finance not found");
    }

    return finance;
  }
}
