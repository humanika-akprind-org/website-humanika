import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
} from "@/domain/entities/event.entity";
import type { Department, Status } from "@/domain/enums";

// Event-specific repository interface
export interface IEventRepository {
  /** Find all events */
  findAll(): Promise<Event[]>;

  /** Find an event by ID */
  findById(id: string): Promise<Event | null>;

  /** Find events with filters and pagination */
  findMany(
    filters?: EventFilters,
    pagination?: BasePagination,
  ): Promise<{ records: Event[]; pagination: BasePaginationResult }>;

  /** Find event by slug */
  findBySlug(slug: string): Promise<Event | null>;

  /** Find events by department */
  findByDepartment(department: Department): Promise<Event[]>;

  /** Find events by status */
  findByStatus(status: Status): Promise<Event[]>;

  /** Find events by period */
  findByPeriod(periodId: string): Promise<Event[]>;

  /** Create a new event */
  create(data: CreateEventInput): Promise<Event>;

  /** Update an existing event */
  update(id: string, data: UpdateEventInput): Promise<Event>;

  /** Delete an event */
  delete(id: string): Promise<void>;

  /** Count events with optional filter */
  count(where?: BaseFilter): Promise<number>;

  /** Create approval record for an event */
  createApproval(eventId: string, userId: string, note: string): Promise<void>;
}

// Filter types for Event queries
export interface EventFilters extends BaseFilter {
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
