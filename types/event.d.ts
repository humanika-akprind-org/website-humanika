import { Department, Status } from "./enums";
import { User } from "./user";
import { Period } from "./period";
import { WorkProgram } from "./work";

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
    department: Department | null;
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
