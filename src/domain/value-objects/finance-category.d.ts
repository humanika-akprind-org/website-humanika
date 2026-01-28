import { FinanceType } from "../enums";

export interface FinanceCategory {
  id: string;
  name: string;
  description?: string | null;
  type: FinanceType;
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

export interface UpdateFinanceCategoryInput extends Partial<CreateFinanceCategoryInput> {}

export interface FinanceCategoryFilter {
  type?: FinanceType;
  search?: string;
}
