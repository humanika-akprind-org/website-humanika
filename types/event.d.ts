import { Department, Status, UserRole, Position } from "./enums";
import { User } from "./user";
import { Period } from "./period";
import { WorkProgram } from "./work";
import { Approval } from "./approval";
import { EventCategory } from "./event-category";
import { Gallery } from "./gallery";
import { Finance } from "./finance";
import { Letter } from "./letter";
import { Document } from "./document";

export interface ScheduleItem {
  date: string; // ISO 8601 string: "2024-10-15T09:00:00.000Z"
  location: string; // Location of the schedule (e.g., "Jakarta Convention Center")
  startTime?: string; // Optional: "09:00"
  endTime?: string; // Optional: "17:00"
  notes?: string; // Optional: "Session 1 - Opening"
}

export interface Event {
  id: string;
  name: string;
  slug: string;
  thumbnail?: string | null;
  description: string;
  responsibleId: string;
  responsible: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: UserRole;
    department: Department | null;
    position: Position | null;
    isActive: boolean;
    verifiedAccount: boolean;
    attemptLogin: number;
    blockExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    avatarColor: string;
  };
  goal: string;
  department: Department;
  periodId: string;
  period: Period;
  schedules: ScheduleItem[];
  status: Status;
  workProgramId?: string | null;
  workProgram?: WorkProgram | null;
  categoryId?: string | null;
  category?: EventCategory | null;
  approvals: Approval[];
  galleries: Gallery[];
  finances: Finance[];
  letters: Letter[];
  documents: Document[];
  createdAt: Date;
  updatedAt: Date;
}

// Helper type for components that need date range from schedules
export type EventDateRange = {
  startDate: Date | null;
  endDate: Date | null;
  hasSchedules: boolean;
};

export interface EventFormData {
  name: string;
  description: string;
  goal: string;
  department: Department;
  periodId: string;
  responsibleId: string;
  schedules: ScheduleItem[];
  workProgramId: string;
  categoryId: string;
  thumbnailFile?: File;
}

export interface CreateEventInput {
  name: string;
  thumbnail?: string | null;
  description: string;
  responsibleId: string;
  goal: string;
  department: Department;
  periodId: string;
  schedules: ScheduleItem[];
  funds: number;
  workProgramId?: string;
  categoryId?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: Status;
}

export interface EventFilter {
  department?: Department;
  status?: Status | string;
  periodId?: string;
  workProgramId?: string;
  search?: string;
  scheduleStartDate?: string;
  scheduleEndDate?: string;
  date?: string;
  location?: string;
}
