import { type Status, type FinanceType } from "../enums";
import { type User } from "./user.entity";
import { type FinanceCategory } from "../value-objects/finance-category";
import { type Approval } from "./approval.entity";
import { type WorkProgram } from "./work-program.entity";
import { type Period } from "./period.entity";

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
  periodId?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  category?: FinanceCategory | null;
  workProgram?: WorkProgram | null;
  period?: Period | null;
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
  periodId?: string | null;
}

export interface UpdateFinanceInput extends Partial<CreateFinanceInput> {
  status?: Status;
}

export interface FinanceFilter {
  type?: FinanceType;
  status?: Status;
  categoryId?: string;
  workProgramId?: string;
  periodId?: string;
  search?: string;
  startDate?: string;
  endDate?: string;
}
