import { ApprovalType, StatusApproval } from "./enums";

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
  approvals: Approval[];
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
