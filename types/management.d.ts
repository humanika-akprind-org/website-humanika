import { Department, Position } from "./enums";

export interface Management {
  isActive: unknown;
  id: string;
  userId: string;
  periodId: string;
  position: Position;
  department: Department;
  photo?: string;
  createdAt: Date;
  updatedAt: Date;
  user?: User;
  period?: Period;
}

export interface ManagementFormData {
  userId: string;
  periodId: string;
  position: Position;
  department: Department;
  photoFile?: File;
  photo?: string;
}

export interface ManagementServerData {
  userId: string;
  periodId: string;
  position: Position;
  department: Department;
  photo?: string | null;
}

export interface ManagementApiResponse {
  success: boolean;
  data?: Management | Management[];
  message?: string;
  error?: string;
}
