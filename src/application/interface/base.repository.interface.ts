/**
 * Base Repository Interface - Generic CRUD operations
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the standard CRUD operations that all repositories should implement.
 * Use this as a base for entity-specific repositories.
 */

export interface IBaseRepository<T, TId, TCreate, TUpdate> {
  /** Find all records */
  findAll(): Promise<T[]>;

  /** Find a record by ID */
  findById(id: TId): Promise<T | null>;

  /** Create a new record */
  create(data: TCreate): Promise<T>;

  /** Update an existing record */
  update(id: TId, data: TUpdate): Promise<T>;

  /** Delete a record */
  delete(id: TId): Promise<void>;

  /** Count records with optional filter */
  count(where?: unknown): Promise<number>;
}
