/**
 * Event Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository implements the IEventRepository interface
 * using Prisma ORM for database operations.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
} from "@/domain/entities/event.entity";
import type { User } from "@/domain/entities/user.entity";
import type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
} from "@/application/interface/event.repository.interface";
import {
  getEvents,
  getEvent,
  createEvent,
  updateEvent,
  deleteEvent,
} from "./index";
import { getEventBySlug } from "./get-event-by-slug.repository";
import { type Department, type Status } from "@/domain/enums";
import { getCurrentUser } from "@/presentation/lib/auth-server";

// Type alias for user context matching the repository function signatures
type UserWithId = Pick<User, "id">;

/**
 * Helper function to get current user from auth context
 */
async function getCurrentUserFromContext(): Promise<UserWithId | null> {
  try {
    const user = await getCurrentUser();
    if (!user) return null;
    return { id: user.id };
  } catch {
    return null;
  }
}

/**
 * Event Repository Prisma Implementation
 *
 * This class implements the IEventRepository interface
 * for Clean Architecture compliance.
 */
export class EventRepositoryPrisma implements IEventRepository {
  /**
   * Get all events
   */
  async findAll(): Promise<Event[]> {
    return (await getEvents({})) as unknown as Event[];
  }

  /**
   * Get all events with optional filtering and pagination
   */
  async findMany(
    filters?: EventFilters,
    pagination?: EventPagination,
  ): Promise<{ records: Event[]; pagination: EventPaginationResult }> {
    const events = await getEvents(filters ?? {});

    // Get total count for pagination
    const total = events.length;

    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;
    const skip = (page - 1) * limit;

    // Get paginated events
    const paginatedEvents = events.slice(skip, skip + limit);

    // Calculate pagination metadata
    const totalPages = Math.ceil(total / limit);

    return {
      records: paginatedEvents as unknown as Event[],
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    };
  }

  /**
   * Get a single event by ID
   */
  async findById(id: string): Promise<Event | null> {
    return (await getEvent(id)) as unknown as Event | null;
  }

  /**
   * Get event by slug
   */
  async findBySlug(slug: string): Promise<Event | null> {
    return (await getEventBySlug(slug)) as unknown as Event | null;
  }

  /**
   * Get events by department
   */
  async findByDepartment(department: Department): Promise<Event[]> {
    return (await getEvents({ department })) as unknown as Event[];
  }

  /**
   * Get events by status
   */
  async findByStatus(status: Status): Promise<Event[]> {
    return (await getEvents({ status })) as unknown as Event[];
  }

  /**
   * Get events by period
   */
  async findByPeriod(periodId: string): Promise<Event[]> {
    return (await getEvents({ periodId })) as unknown as Event[];
  }

  /**
   * Create a new event
   */
  async create(data: CreateEventInput): Promise<Event> {
    const user = await getCurrentUserFromContext();
    return (await createEvent(
      data,
      user ?? { id: "system" },
    )) as unknown as Event;
  }

  /**
   * Update an existing event
   */
  async update(id: string, data: UpdateEventInput): Promise<Event> {
    const user = await getCurrentUserFromContext();
    return (await updateEvent(
      id,
      data,
      user ?? { id: "system" },
    )) as unknown as Event;
  }

  /**
   * Delete an event
   */
  async delete(id: string): Promise<void> {
    const user = await getCurrentUserFromContext();
    await deleteEvent(id, user ?? { id: "system" });
  }

  /**
   * Count events with optional filter
   */
  async count(where?: EventFilters): Promise<number> {
    const events = await getEvents(where ?? {});
    return events.length;
  }

  /**
   * Create approval record for an event
   */
  async createApproval(
    eventId: string,
    userId: string,
    note: string,
  ): Promise<void> {
    const { prisma } = await import("@/presentation/lib/prisma");
    await prisma.approval.create({
      data: {
        entityType: "EVENT",
        entityId: eventId,
        userId,
        status: "PENDING",
        note,
      },
    });
  }
}
