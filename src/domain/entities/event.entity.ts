import { Department, Status, UserRole, Position } from "../enums/enums";
import { User } from "./user";
import { Period } from "./period";
import { WorkProgram } from "./work";
import { Approval } from "./approval";
import { EventCategory } from "../value-objects/event-category";
import { Gallery } from "./gallery";
import { Finance } from "./finance";
import { Letter } from "./letter";
import { Document } from "./document";

/**
 * Represents a single schedule item within an event.
 * Used to track multiple activities/venues across the event duration.
 */
export interface ScheduleItem {
  /** ISO 8601 date string (e.g., "2024-10-15T09:00:00.000Z") */
  date: string;
  /** Location name (e.g., "Jakarta Convention Center") */
  location: string;
  /** Start time in HH:mm format (e.g., "09:00") */
  startTime?: string;
  /** End time in HH:mm format (e.g., "17:00") */
  endTime?: string;
  /** Additional notes about this schedule item */
  notes?: string;
}

/**
 * Main Event entity representing a humanika event/activity.
 */
export interface Event {
  /** Unique identifier for the event */
  id: string;
  /** Display name of the event */
  name: string;
  /** URL-friendly slug for the event */
  slug: string;
  /** Path to event thumbnail image */
  thumbnail?: string | null;
  /** Detailed description of the event */
  description: string;
  /** ID of the user responsible for this event */
  responsibleId: string;
  /** User object responsible for the event */
  responsible: User;
  /** Purpose or objective of the event */
  goal: string;
  /** Department organizing the event */
  department: Department;
  /** ID of the associated period */
  periodId: string;
  /** Period object containing year range */
  period: Period;
  /** Array of schedule items for the event */
  schedules: ScheduleItem[];
  /** Current status of the event */
  status: Status;
  /** ID of associated work program */
  workProgramId?: string | null;
  /** Associated work program details */
  workProgram?: WorkProgram | null;
  /** ID of event category */
  categoryId?: string | null;
  /** Category details for the event */
  category?: EventCategory | null;
  /** Budget allocated for this event */
  funds?: number | null;
  /** Maximum number of participants allowed */
  maxParticipants?: number | null;
  /** Current number of participants registered */
  participantCount?: number | null;
  /** Timestamp when event was published (null if not published) */
  publishedAt?: Date | null;
  /** Array of approval records for this event */
  approvals: Approval[];
  /** Array of gallery images related to this event */
  galleries: Gallery[];
  /** Array of financial records for this event */
  finances: Finance[];
  /** Array of letters related to this event */
  letters: Letter[];
  /** Array of documents related to this event */
  documents: Document[];
  /** Creation timestamp */
  createdAt: Date;
  /** Last update timestamp */
  updatedAt: Date;
}

/**
 * Helper type for components that need date range from schedules.
 * Provides easy access to event start/end dates derived from schedule items.
 */
export type EventDateRange = {
  /** Earliest schedule date or null if no schedules */
  startDate: Date | null;
  /** Latest schedule date or null if no schedules */
  endDate: Date | null;
  /** Whether the event has any schedule items */
  hasSchedules: boolean;
};

/**
 * Form data structure for creating or updating an event.
 * Used in UI forms for event management.
 */
export interface EventFormData {
  /** Display name of the event */
  name: string;
  /** Detailed description of the event */
  description: string;
  /** Purpose or objective of the event */
  goal: string;
  /** Department organizing the event */
  department: Department;
  /** ID of the associated period */
  periodId: string;
  /** ID of the user responsible for this event */
  responsibleId: string;
  /** Array of schedule items for the event */
  schedules: ScheduleItem[];
  /** ID of associated work program (optional) */
  workProgramId?: string;
  /** ID of event category (optional) */
  categoryId?: string;
  /** Optional thumbnail file for upload */
  thumbnailFile?: File;
}

/**
 * Input type for creating a new event.
 * Defines all required and optional fields when creating an event.
 */
export interface CreateEventInput {
  /** Display name of the event */
  name: string;
  /** Path to event thumbnail image */
  thumbnail?: string | null;
  /** Detailed description of the event */
  description: string;
  /** ID of the user responsible for this event */
  responsibleId: string;
  /** Purpose or objective of the event */
  goal: string;
  /** Department organizing the event */
  department: Department;
  /** ID of the associated period */
  periodId: string;
  /** Array of schedule items for the event */
  schedules: ScheduleItem[];
  /** Budget allocated for this event */
  funds?: number;
  /** ID of associated work program (optional) */
  workProgramId?: string;
  /** ID of event category (optional) */
  categoryId?: string;
  /** Maximum number of participants allowed (optional) */
  maxParticipants?: number;
}

/**
 * Input type for updating an existing event.
 * All fields are optional - only provided fields will be updated.
 */
export interface UpdateEventInput extends Partial<CreateEventInput> {
  /** New status for the event (optional) */
  status?: Status;
}

/**
 * Filter options for querying events.
 * All filters are optional - omitted filters are not applied.
 */
export interface EventFilter {
  /** Filter by department */
  department?: Department;
  /** Filter by status */
  status?: Status;
  /** Filter by period ID */
  periodId?: string;
  /** Filter by work program ID */
  workProgramId?: string;
  /** Search in event name and description */
  search?: string;
  /** Filter events starting on or after this date */
  scheduleStartDate?: string;
  /** Filter events ending on or before this date */
  scheduleEndDate?: string;
  /** Filter events on a specific date */
  date?: string;
  /** Filter events by location */
  location?: string;
}
