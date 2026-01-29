import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type { EventCategory } from "@/domain/value-objects/event-category";
import type {
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";

/**
 * Event Category Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines EventCategory-specific operations.
 */
export interface IEventCategoryRepository {
  /** Find all event categories ordered by name */
  findAll(): Promise<EventCategory[]>;

  /** Find a single event category by ID */
  findById(id: string): Promise<EventCategory | null>;

  /** Find event category by name (for duplicate checking) */
  findByName(name: string): Promise<EventCategory | null>;

  /** Find event categories with pagination */
  findMany(
    filters?: BaseFilter,
    pagination?: BasePagination,
  ): Promise<{ records: EventCategory[]; pagination: BasePaginationResult }>;

  /** Create a new event category */
  create(
    data: CreateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory>;

  /** Update an existing event category */
  update(id: string, data: UpdateEventCategoryInput): Promise<EventCategory>;

  /** Delete an event category */
  delete(id: string, userId: string): Promise<void>;

  /** Count event categories */
  count(where?: BaseFilter): Promise<number>;
}

/**
 * Event Category Filter
 */
export interface EventCategoryFilter extends BaseFilter {
  search?: string;
}
