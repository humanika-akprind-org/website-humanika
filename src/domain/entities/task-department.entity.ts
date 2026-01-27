import { type Department } from "../enums";
import { type Status } from "../enums";

export interface DepartmentTask {
  id: string;
  title: string;
  subtitle?: string;
  note: string;
  department: Department;
  userId?: string;
  workProgramId?: string;
  status: Status;
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
  status?: Status;
}

export interface UpdateDepartmentTaskInput extends Partial<CreateDepartmentTaskInput> {}

export interface DepartmentTaskFilter {
  department?: Department;
  status?: Status;
  userId?: string;
  search?: string;
}

export type TaskFilters = DepartmentTaskFilter;
