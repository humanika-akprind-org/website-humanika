import { Department } from "./enums";
import type { Prisma } from "@prisma/client";

export interface DepartmentTask {
  id: string;
  title: string;
  subtitle?: string;
  note: string;
  department: Department;
  userId?: string;
  workProgramId?: string;
  status: Prisma.Status;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  workProgram?: {
    id: string;
    name: string;
  };
}

export interface CreateDepartmentTaskInput {
  title: string;
  subtitle?: string;
  note: string;
  department: Department;
  userId?: string;
  workProgramId?: string;
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
