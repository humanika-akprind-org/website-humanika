/**
 * Event Category Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IEventCategoryRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  IEventCategoryRepository,
  EventCategoryFilter,
  EventCategoryPagination,
  EventCategoryPaginationResult,
} from "@/application/interface/event-category.repository.interface";
import type {
  EventCategory,
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";
import {
  getEventCategories,
  getEventCategoryById,
  createEventCategory,
  updateEventCategory,
  deleteEventCategory,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

// Type alias for filter
type GetEventCategoriesFilter = {
  search?: string;
};

/**
 * Event Category Repository Prisma Implementation
 *
 * This class implements the IEventCategoryRepository interface
 * for Clean Architecture compliance.
 */
export class EventCategoryRepositoryPrisma implements IEventCategoryRepository {
  /**
   * Get all event categories
   */
  async findAll(): Promise<EventCategory[]> {
    return (await getEventCategories({})) as EventCategory[];
  }

  /**
   * Get all event categories with optional filtering and pagination
   */
  async findMany(
    filter?: EventCategoryFilter,
    pagination?: EventCategoryPagination,
  ): Promise<{
    records: EventCategory[];
    pagination: EventCategoryPaginationResult;
  }> {
    const filterParam: GetEventCategoriesFilter = {};
    if (filter?.search) {
      filterParam.search = filter.search;
    }
    const records = await getEventCategories(filterParam);

    // Get total count for pagination
    const total = records.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated records
    const paginatedRecords = records.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedRecords as EventCategory[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single event category by ID
   */
  async findById(id: string): Promise<EventCategory | null> {
    return (await getEventCategoryById(id)) as EventCategory | null;
  }

  /**
   * Find event category by name (for duplicate checking)
   */
  async findByName(name: string): Promise<EventCategory | null> {
    const records = await getEventCategories({ search: name });
    const category = records.find(
      (cat) => cat.name.toLowerCase() === name.toLowerCase(),
    );
    return (category as EventCategory | null) || null;
  }

  /**
   * Create a new event category
   */
  async create(
    data: CreateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory> {
    const user: UserWithId = { id: userId };
    return (await createEventCategory(data, user)) as EventCategory;
  }

  /**
   * Update an existing event category
   */
  async update(
    id: string,
    data: UpdateEventCategoryInput,
  ): Promise<EventCategory> {
    const user: UserWithId = { id: "" };
    return (await updateEventCategory(id, data, user)) as EventCategory;
  }

  /**
   * Delete an event category
   */
  async delete(id: string, userId: string): Promise<void> {
    const user: UserWithId = { id: userId };
    await deleteEventCategory(id, user);
  }

  /**
   * Count event categories with optional filter
   */
  async count(_where?: Record<string, unknown>): Promise<number> {
    const filterParam: GetEventCategoriesFilter = {};
    const records = await getEventCategories(filterParam);
    return records.length;
  }
}
