import { Department } from "./enums";
import type { Prisma } from "@prisma/client";

export interface DepartmentTask {
  id: string;
  note: string;
  department: Department;
  userId?: string;
  status: Prisma.Status;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface CreateDepartmentTaskInput {
  note: string;
  department: Department;
  userId?: string;
  status?: Prisma.Status;
}

export interface UpdateDepartmentTaskInput
  extends Partial<CreateDepartmentTaskInput> {}

export interface DepartmentTaskFilter {
  department?: Department;
  status?: Prisma.Status;
  userId?: string;
  search?: string;
}
