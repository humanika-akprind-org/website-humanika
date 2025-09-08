import { Department, Status } from "./enums";
import { User } from "./user";
import { Period } from "./period";

export interface WorkProgram {
  id: string;
  name: string;
  department: Department;
  schedule: string;
  status: Status;
  funds: number;
  usedFunds: number;
  remainingFunds: number;
  goal: string;
  periodId: string;
  period: Period;
  responsibleId: string;
  responsible: User;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateWorkProgramInput {
  name: string;
  department: Department;
  schedule: string;
  funds: number;
  usedFunds?: number;
  goal: string;
  periodId: string;
  responsibleId: string;
}

export interface UpdateWorkProgramInput
  extends Partial<CreateWorkProgramInput> {
  status?: Status;
  usedFunds?: number;
}

export interface WorkProgramFilter {
  department?: Department;
  status?: Status;
  periodId?: string;
  search?: string;
}
