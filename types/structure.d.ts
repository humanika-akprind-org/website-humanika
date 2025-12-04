import { Status } from "./enums";
import { Period } from "./period";

export interface OrganizationalStructure {
  id: string;
  name: string;
  status: Status;
  periodId: string;
  period?: Period;
  decree: string; // URL file Surat Keputusan (SK)
  structure?: string | null; // JSX as string
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateOrganizationalStructureInput {
  name: string;
  periodId: string;
  status?: Status;
  decree: string;
  structure?: string | null;
}

export interface UpdateOrganizationalStructureInput
  extends Partial<CreateOrganizationalStructureInput> {
  status?: Status;
}

export interface OrganizationalStructureFilter {
  status?: Status;
  periodId?: string;
  search?: string;
}
