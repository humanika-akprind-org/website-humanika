import { FinanceType } from "./enums";

export interface FinanceCategory {
  id: string;
  name: string;
  description?: string;
  type: FinanceType;
  isActive?: boolean;
  createdAt: Date;
  updatedAt: Date;
  _count?: {
    finances: number;
  };
}

export interface CreateFinanceCategoryInput {
  name: string;
  description?: string;
  type: FinanceType;
}

export interface UpdateFinanceCategoryInput
  extends Partial<CreateFinanceCategoryInput> {
  isActive?: boolean;
}

export interface FinanceCategoryFilter {
  type?: FinanceType;
  isActive?: boolean;
  search?: string;
}
