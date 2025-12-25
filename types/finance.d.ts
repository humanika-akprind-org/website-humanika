import { Department, Status, FinanceType } from "./enums";
import { User } from "./user";
import { FinanceCategory } from "./finance-category";
import { Approval } from "./approval";
import { WorkProgram } from "./work";

export interface Finance {
  id: string;
  name: string;
  amount: number;
  description: string;
  date: Date;
  type: FinanceType;
  userId: string;
  status: Status;
  proof?: string | null;
  categoryId?: string | null;
  workProgramId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  category?: FinanceCategory | null;
  workProgram?: WorkProgram | null;
  user: User;
  approvals?: Approval[];
}

export interface CreateFinanceInput {
  name: string;
  amount: number;
  description: string;
  date: Date;
  categoryId?: string | null;
  type: FinanceType;
  proof?: string | null;
  workProgramId?: string | null;
}

export interface UpdateFinanceInput extends Partial<CreateFinanceInput> {
  status?: Status;
}

export interface FinanceFilter {
  type?: FinanceType;
  status?: Status;
  categoryId?: string;
  workProgramId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
