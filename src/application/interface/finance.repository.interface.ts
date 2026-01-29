import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
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
}

// Re-export for convenience
export type { FinanceFilter };
