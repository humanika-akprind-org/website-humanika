import type { IFinanceRepository } from "@/application/interface/finance.repository.interface";

/**
 * Delete Finance Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting finances with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class DeleteFinanceUseCase {
  constructor(private readonly financeRepository: IFinanceRepository) {}

  /**
   * Execute the use case
   * @param id - The ID of the finance to delete
   * @param user - User context for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, _user: { id: string }): Promise<void> {
    // Validate ID parameter
    if (!id || id.trim() === "") {
      throw new Error("Finance ID is required");
    }

    // Check if finance exists before deletion
    const finance = await this.financeRepository.getFinanceById(id.trim());
    if (!finance) {
      throw new Error("Finance not found");
    }

    // Execute repository call
    await this.financeRepository.deleteFinance(id.trim());
  }
}
