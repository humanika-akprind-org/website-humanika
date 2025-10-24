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
