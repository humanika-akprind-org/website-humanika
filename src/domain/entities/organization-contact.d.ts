import { Period } from "./period";

export interface MissionItem {
  icon?: string;
  title: string;
  description: string;
}

export interface OrganizationContact {
  id: string;
  vision: string;
  mission: string | string[] | MissionItem[]; // Json type from database, can be string, array of strings, or array of MissionItem objects
  phone?: string | null;
  email: string;
  address: string;
  periodId: string;
  period: Period;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationContactInput {
  vision: string;
  mission: string | string[];
  phone?: string;
  email: string;
  address: string;
  periodId: string;
}

export interface UpdateOrganizationContactInput
  extends Partial<CreateOrganizationContactInput> {}

export interface OrganizationContactFilter {
  periodId?: string;
  period?: string;
}
