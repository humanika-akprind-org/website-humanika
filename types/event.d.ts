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
  startDate: Date;
  endDate: Date;
  funds: number;
  usedFunds: number;
  remainingFunds: number;
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

export interface CreateEventInput {
  name: string;
  thumbnail?: string | null;
  description: string;
  responsibleId: string;
  goal: string;
  department: Department;
  periodId: string;
  startDate: Date;
  endDate: Date;
  funds: number;
  workProgramId?: string;
  categoryId?: string;
}

export interface UpdateEventInput extends Partial<CreateEventInput> {
  status?: Status;
  usedFunds?: number;
}

export interface EventFilter {
  department?: Department;
  status?: Status;
  periodId?: string;
  workProgramId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
