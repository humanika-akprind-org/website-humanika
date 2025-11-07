import type { StatusApproval } from "@prisma/client";
import type { ApprovalType } from "@/types/enums";

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

export interface ApprovalsResponse {
  approvals: ApprovalWithRelations[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
