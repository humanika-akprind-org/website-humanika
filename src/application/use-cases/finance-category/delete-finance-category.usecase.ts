/**
 * Delete Finance Category Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting finance categories
 * with validation and logging.
 */

import type { FinanceCategory } from "@/domain/value-objects/finance-category";

/**
 * Repository interface for finance category write operations
 */
export interface IFinanceCategoryRepository {
  getFinanceCategoryById(id: string): Promise<FinanceCategory | null>;
  deleteFinanceCategory(id: string, user: { id: string }): Promise<void>;
}

/**
 * Delete Finance Category Use Case
 */
export class DeleteFinanceCategoryUseCase {
  constructor(
    private readonly financeCategoryRepository: IFinanceCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Finance category ID
   * @param user - User context for logging
   * @returns Promise resolving when deletion is complete
   */
  async execute(id: string, user: { id: string }): Promise<void> {
    // Check if category exists
    const existing =
      await this.financeCategoryRepository.getFinanceCategoryById(id);
    if (!existing) {
      throw new Error("Finance category not found");
    }

    // Execute repository call with user context
    await this.financeCategoryRepository.deleteFinanceCategory(id, user);
  }
}
