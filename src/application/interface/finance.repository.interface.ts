import type {
  CreateFinanceInput,
  Finance,
  FinanceFilter,
} from "@/domain/entities/finance.entity";

/**
 * Finance Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for finance data access operations.
 * Following Dependency Inversion Principle - depends on abstractions, not concretions.
 */
export interface IFinanceRepository {
  /**
   * Get all finances with optional filters
   */
  getFinances(filter?: FinanceFilter): Promise<Finance[]>;

  /**
   * Get a single finance by ID
   */
  getFinanceById(id: string): Promise<Finance | null>;

  /**
   * Create a new finance
   */
  createFinance(
    data: CreateFinanceInput,
    user: { id: string },
  ): Promise<Finance>;

  /**
   * Update an existing finance
   */
  updateFinance(
    id: string,
    data: Partial<CreateFinanceInput>,
  ): Promise<Finance>;

  /**
   * Delete a finance
   */
  deleteFinance(id: string): Promise<void>;
}
