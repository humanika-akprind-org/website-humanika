import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type { Period, PeriodFormData } from "@/domain/entities/period.entity";

/**
 * Period Filter
 */
export interface PeriodFilter extends BaseFilter {
  search?: string;
  isActive?: boolean;
}

/**
 * Period Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines Period-specific operations.
 */
export interface IPeriodRepository {
  /** Find all periods */
  findAll(): Promise<Period[]>;

  /** Find a period by ID */
  findById(id: string): Promise<Period | null>;

  /** Find periods with filters and pagination */
  findMany(
    filters?: PeriodFilter,
    pagination?: BasePagination,
  ): Promise<{ records: Period[]; pagination: BasePaginationResult }>;

  /** Create a new period */
  create(data: PeriodFormData): Promise<Period>;

  /** Update an existing period */
  update(id: string, data: Partial<PeriodFormData>): Promise<Period>;

  /** Delete a period */
  delete(id: string): Promise<void>;

  /** Count periods with optional filter */
  count(where?: BaseFilter): Promise<number>;
}
