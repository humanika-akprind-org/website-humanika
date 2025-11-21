import type { Status } from "./enums";
import type { Period } from "./period";
import type { WorkProgram } from "./work";
import type { User } from "./user";

export interface Event {
  id: string;
  name: string;
  description: string;
  department: string;
  periodId: string;
  workProgramId?: string;
  responsibleId: string;
  startDate: string;
  endDate: string;
  status: Status;
  image?: string;
  createdAt: string;
  updatedAt: string;
  period?: Period;
  workProgram?: WorkProgram;
  responsible?: User;
}

export interface CreateEventInput {
  name: string;
  description: string;
  department: string;
  periodId: string;
  workProgramId?: string;
  responsibleId: string;
  startDate: string;
  endDate: string;
  image?: string;
}
