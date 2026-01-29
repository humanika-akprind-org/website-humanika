import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
  BaseStats,
} from "./base.repository.interface";
import type {
  CreateFinanceInput,
  Finance,
  FinanceFilter,
} from "@/domain/entities/finance.entity";

/**
 * Finance Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Finance-specific operations.
 */
export interface IFinanceRepository {
  /** Find all finances */
  findAll(): Promise<Finance[]>;

  /** Find a finance by ID */
  findById(id: string): Promise<Finance | null>;

  /** Find finances with filters and pagination */
  findMany(
    filters?: FinanceFilter,
    pagination?: BasePagination,
  ): Promise<{ records: Finance[]; pagination: BasePaginationResult }>;

  /** Create a new finance */
  create(data: CreateFinanceInput, user: { id: string }): Promise<Finance>;

  /** Update an existing finance */
  update(id: string, data: Partial<CreateFinanceInput>): Promise<Finance>;

  /** Delete a finance */
  delete(id: string): Promise<void>;

  /** Count finances with optional filter */
  count(where?: BaseFilter): Promise<number>;

  // Aliases for backward compatibility with existing use cases
  getFinanceById(id: string): Promise<Finance | null>;
  getFinances(filter?: FinanceFilter): Promise<Finance[]>;
  createFinance(
    data: CreateFinanceInput,
    user: { id: string },
  ): Promise<Finance>;
  updateFinance(
    id: string,
    data: Partial<CreateFinanceInput>,
  ): Promise<Finance>;
  deleteFinance(id: string): Promise<void>;
}

// Re-export for convenience
export type { FinanceFilter };

// Re-export base types with Finance-specific names for convenience
export type { BasePagination as FinancePagination };
export type { BasePaginationResult as FinancePaginationResult };
export type { BaseStats as FinanceStats };
