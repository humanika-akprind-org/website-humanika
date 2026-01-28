/**
 * Get Finance Category By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 */

import type { FinanceCategory } from "@/domain/value-objects/finance-category";

/**
 * Repository interface for finance category read operations
 */
export interface IFinanceCategoryRepository {
  getFinanceCategoryById(id: string): Promise<FinanceCategory | null>;
}

/**
 * Get Finance Category By ID Use Case
 */
export class GetFinanceCategoryByIdUseCase {
  constructor(
    private readonly financeCategoryRepository: IFinanceCategoryRepository,
  ) {}

  /**
   * Execute the use case
   * @param id - Finance category ID
   * @returns Promise resolving to finance category or null
   */
  async execute(id: string): Promise<FinanceCategory | null> {
    const financeCategory =
      await this.financeCategoryRepository.getFinanceCategoryById(id);

    if (!financeCategory) {
      throw new Error("Finance category not found");
    }

    return financeCategory;
  }
}
