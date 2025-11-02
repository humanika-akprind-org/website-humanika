import { Department, Status, FinanceType } from "./enums";
import { User } from "./user";
import { Period } from "./period";
import { Event } from "./event";
import { FinanceCategory } from "./finance-category";
import { Approval } from "./approval";

export interface Finance {
  id: string;
  name: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  type: FinanceType;
  periodId: string;
  eventId?: string | null;
  userId: string;
  status: Status;
  proof?: string | null;
  createdAt: Date;
  updatedAt: Date;
  // Relations
  category: FinanceCategory;
  period: Period;
  event?: Event | null;
  user: User;
  approvals?: Approval[];
}

export interface CreateFinanceInput {
  name: string;
  amount: number;
  description: string;
  date: Date;
  categoryId: string;
  type: FinanceType;
  periodId: string;
  eventId?: string;
  proof?: string | null;
}

export interface UpdateFinanceInput extends Partial<CreateFinanceInput> {
  status?: Status;
}

export interface FinanceFilter {
  type?: FinanceType;
  status?: Status;
  periodId?: string;
  categoryId?: string;
  eventId?: string;
  search?: string;
  startDate?: Date;
  endDate?: Date;
}
