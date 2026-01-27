/**
 * Event Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for Event Category repository operations.
 */

import type { EventCategory } from "@/domain/value-objects/event-category";
import type {
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";

/**
 * Read-only interface for Event Category repository
 * Used by read operations (GET)
 */
export interface IEventCategoryRepository {
  /** Find all categories ordered by name */
  findAll(): Promise<EventCategory[]>;

  /** Find a single category by ID */
  findById(id: string): Promise<EventCategory | null>;

  /** Find category by name (for duplicate checking) */
  findByName(name: string): Promise<EventCategory | null>;

  /** Count categories */
  count(): Promise<number>;
}

/**
 * Extended interface for Event Category repository with write operations
 * Used by write operations (POST, PUT, DELETE) with activity logging
 */
export interface IEventCategoryRepositoryExtended {
  // Read operations
  findAll(): Promise<EventCategory[]>;
  findById(id: string): Promise<EventCategory | null>;
  findByName(name: string): Promise<EventCategory | null>;
  count(): Promise<number>;

  // Write operations with userId for activity logging
  create(
    data: CreateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory>;
  update(
    id: string,
    data: UpdateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory>;
  delete(id: string, userId: string): Promise<void>;
}
