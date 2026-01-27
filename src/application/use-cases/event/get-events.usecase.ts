/**
 * Get Events Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching events with filtering and pagination.
 * Use this for complex read operations that require business logic.
 */

import type {
  IEventRepository,
  EventFilters,
  EventPagination,
  EventPaginationResult,
} from "@/application/interface/event.repository.interface";
import type { Event } from "@/domain/entities/event.entity";
import type { Department, Status } from "@/domain/enums/enums";

interface EventResult {
  events: Event[];
  pagination: EventPaginationResult;
}

export class GetEventsUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to get events with optional filters and pagination
   *
   * @param filters - Optional filters for querying events
   * @param pagination - Optional pagination parameters
   * @returns Events with pagination info
   */
  async execute(
    filters?: EventFilters,
    pagination?: EventPagination,
  ): Promise<EventResult> {
    // Apply default pagination if not provided
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Validate pagination parameters
    if (page < 1) throw new Error("Page must be greater than 0");
    if (limit < 1) throw new Error("Limit must be greater than 0");
    if (limit > 100) throw new Error("Limit cannot exceed 100");

    // Execute the repository method
    const result = await this.eventRepo.findMany(filters, { page, limit });

    return {
      events: result.events,
      pagination: result.pagination,
    };
  }

  /**
   * Execute with query parameters from request URL
   * Useful for converting URL search params to filters
   */
  async executeFromQueryParams(
    searchParams: URLSearchParams,
  ): Promise<EventResult> {
    const filters: EventFilters = {
      department: searchParams.has("department")
        ? (searchParams.get("department") as Department)
        : undefined,
      status: searchParams.has("status")
        ? (searchParams.get("status") as Status)
        : undefined,
      periodId: searchParams.get("periodId") || undefined,
      workProgramId: searchParams.get("workProgramId") || undefined,
      search: searchParams.get("search") || undefined,
      scheduleStartDate: searchParams.get("scheduleStartDate") || undefined,
      scheduleEndDate: searchParams.get("scheduleEndDate") || undefined,
      date: searchParams.get("date") || undefined,
      location: searchParams.get("location") || undefined,
    };

    const pagination: EventPagination = {
      page: parseInt(searchParams.get("page") || "1", 10),
      limit: parseInt(searchParams.get("limit") || "10", 10),
    };

    return this.execute(filters, pagination);
  }
}
