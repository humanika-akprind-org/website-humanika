import { Department, Position } from "./enums";
import { User } from "./user";

export interface Management {
  id: string;
  userId: string;
  periodId: string;
  position: Position;
  photo: string | null;
  department: Department;
  createdAt: string;
  updatedAt: string;
  user: User;
  period: Period;
}

export interface Period {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateManagementData {
  userId: string;
  periodId: string;
  position: Position;
  department: Department;
  photo?: File | null;
}

export interface UpdateManagementData extends Partial<CreateManagementData> {
  id: string;
}

export interface ManagementsResponse {
  managements: Management[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiResponse<T> {
  data?: T;
  error?: string;
}
