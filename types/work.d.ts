import { Department, Status, UserRole, Position } from "./enums";
import { User } from "./user";
import { Period } from "./period";
import { Approval } from "./approval";

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
  approvals?: Approval[];
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
  status?: Status;
}

export interface UpdateWorkProgramInput {
  name?: string;
  department?: Department;
  schedule?: string;
  funds?: number;
  usedFunds?: number;
  goal?: string;
  periodId?: string;
  responsibleId?: string;
  status?: Status;
  approvalId?: string;
}

export interface WorkProgramFilter {
  department?: Department;
  status?: Status;
  periodId?: string;
  search?: string;
}
