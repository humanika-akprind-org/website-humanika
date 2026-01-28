/**
 * Finance Category Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for finance category data access operations.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */

import type {
  CreateFinanceCategoryInput,
  FinanceCategory,
  FinanceCategoryFilter,
} from "@/domain/value-objects/finance-category";

/**
 * Finance Category Repository Interface
 */
export interface IFinanceCategoryRepository {
  /**
   * Get all finance categories with optional filters
   */
  getFinanceCategories(
    filter?: FinanceCategoryFilter,
  ): Promise<FinanceCategory[]>;

  /**
   * Get a single finance category by ID
   */
  getFinanceCategoryById(id: string): Promise<FinanceCategory | null>;

  /**
   * Create a new finance category
   */
  createFinanceCategory(
    data: CreateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory>;

  /**
   * Update an existing finance category
   */
  updateFinanceCategory(
    id: string,
    data: Partial<CreateFinanceCategoryInput>,
    user: { id: string },
  ): Promise<FinanceCategory>;

  /**
   * Delete a finance category
   */
  deleteFinanceCategory(id: string, user: { id: string }): Promise<void>;
}
