import { ApprovalType } from "./enums";
import { StatusApproval } from "@prisma/client";

export interface Approval {
  id: string;
  entityType: ApprovalType;
  entityId: string;
  userId: string;
  status: StatusApproval;
  note?: string;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    name: string;
    email: string;
    role: string;
    department?: string;
  };
  workProgram?: any;
  event?: any;
  finance?: any;
  document?: any;
  letter?: any;
}

export interface ApprovalsResponse {
  approvals: ApprovalWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CreateApprovalInput {
  entityType: ApprovalType;
  entityId: string;
  userId: string;
  status?: StatusApproval;
  note?: string;
}

export interface UpdateApprovalInput {
  status: StatusApproval;
  note?: string;
}

export interface UpdateApprovalData {
  status: StatusApproval;
  note?: string;
}

export interface CreateApprovalData {
  entityType: ApprovalType;
  entityId: string;
  userId: string;
  status?: StatusApproval;
  note?: string;
}

export interface ApprovalFilters {
  status?: string | null;
  entityType?: string | null;
  page?: number;
  limit?: number;
}

export interface ApprovalWithRelations {
  id: string;
  status: StatusApproval;
  note?: string | null;
  entityType: string;
  entityId: string;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
    department: string | null;
  };
  workProgram?: {
    id: string;
    name: string;
    department: string;
    status: string;
  } | null;
  event?: {
    id: string;
    name: string;
    department: string;
    status: string;
  } | null;
  finance?: {
    id: string;
    name: string;
    amount: number;
    type: string;
    status: string;
  } | null;
  document?: {
    id: string;
    name: string;
    type: string;
    status: string;
  } | null;
  letter?: {
    id: string;
    regarding: string;
    type: string;
    status: string;
  } | null;
}
