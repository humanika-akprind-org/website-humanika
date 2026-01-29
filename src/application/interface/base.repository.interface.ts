/**
 * Base Repository Interface - Generic CRUD operations
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the standard CRUD operations that all repositories should implement.
 * Use this as a base for entity-specific repositories.
 */

// Generic types for base repository
export type BaseFilter = Record<string, unknown>;

export interface BasePagination {
  page?: number;
  limit?: number;
}

export interface BasePaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface BaseStats {
  total: number;
  [key: string]: number | string | unknown;
}

export interface IBaseRepository<T, TId, TCreate, TUpdate> {
  /** Find all records */
  findAll(): Promise<T[]>;

  /** Find a record by ID */
  findById(id: TId): Promise<T | null>;

  /** Find records with filters and pagination */
  findMany(
    filters?: BaseFilter,
    pagination?: BasePagination,
  ): Promise<{ records: T[]; pagination: BasePaginationResult }>;

  /** Create a new record */
  create(data: TCreate): Promise<T>;

  /** Update an existing record */
  update(id: TId, data: TUpdate): Promise<T>;

  /** Delete a record */
  delete(id: TId): Promise<void>;

  /** Count records with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Get statistics/filters */
  getStats(filters?: BaseFilter): Promise<BaseStats>;
}
