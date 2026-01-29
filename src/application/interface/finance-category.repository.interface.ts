import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  CreateFinanceCategoryInput,
  FinanceCategory,
  FinanceCategoryFilter,
} from "@/domain/value-objects/finance-category";

/**
 * Finance Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines FinanceCategory-specific operations.
 */
export interface IFinanceCategoryRepository {
  /** Find all finance categories */
  findAll(): Promise<FinanceCategory[]>;

  /** Find a finance category by ID */
  findById(id: string): Promise<FinanceCategory | null>;

  /** Find finance categories with filters and pagination */
  findMany(
    filters?: FinanceCategoryFilter,
    pagination?: BasePagination,
  ): Promise<{ records: FinanceCategory[]; pagination: BasePaginationResult }>;

  /** Create a new finance category */
  create(
    data: CreateFinanceCategoryInput,
    user: { id: string },
  ): Promise<FinanceCategory>;

  /** Update an existing finance category */
  update(
    id: string,
    data: Partial<CreateFinanceCategoryInput>,
  ): Promise<FinanceCategory>;

  /** Delete a finance category */
  delete(id: string): Promise<void>;

  /** Count finance categories with optional filter */
  count(where?: BaseFilter): Promise<number>;
}

// Re-export for convenience
export type { FinanceCategoryFilter };
