/**
 * Event Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface extends IBaseRepository with Event-specific operations.
 */

import type { IBaseRepository } from "./base.repository.interface";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
} from "@/domain/entities/event.entity";
import type { Department, Status } from "@/domain/enums/enums";

// Extend the base interface for Event entity
export interface IEventRepository extends IBaseRepository<
  Event,
  string,
  CreateEventInput,
  UpdateEventInput
> {
  // Event-specific methods (if any)

  /** Find events with filters and pagination */
  findMany(
    filters?: EventFilters,
    pagination?: EventPagination,
  ): Promise<{ events: Event[]; pagination: EventPaginationResult }>;

  /** Find event by slug */
  findBySlug(slug: string): Promise<Event | null>;

  /** Find events by department */
  findByDepartment(department: Department): Promise<Event[]>;

  /** Find events by status */
  findByStatus(status: Status): Promise<Event[]>;

  /** Find events by period */
  findByPeriod(periodId: string): Promise<Event[]>;

  /** Create approval record for an event */
  createApproval(eventId: string, userId: string, note: string): Promise<void>;
}

// Filter types for Event queries
export interface EventFilters {
  department?: Department;
  status?: Status;
  periodId?: string;
  workProgramId?: string;
  search?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  date?: string;
  location?: string;
}

// Pagination input
export interface EventPagination {
  page?: number;
  limit?: number;
}

// Pagination result
export interface EventPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
