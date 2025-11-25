import { Department, Status } from "./enums";
import { Period } from "./period";

export interface Project {
  id: string;
  name: string;
  department: Department;
  schedule: string;
  status: Status;
  goal: string;
  periodId: string;
  period: Period;
  responsibleId: string;
  responsible: {
    id: string;
    name: string;
    email: string;
    username: string;
    role: string;
    department: Department | null;
    position: string | null;
    isActive: boolean;
    verifiedAccount: boolean;
    attemptLogin: number;
    blockExpires: Date | null;
    createdAt: Date;
    updatedAt: Date;
    avatarColor: string;
  };
  createdAt: Date;
  updatedAt: Date;
}
