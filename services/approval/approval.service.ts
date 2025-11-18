// Re-export everything from the modular services
export { getApprovals } from "./approval-queries.service";
export {
  createApproval,
  updateApproval,
  deleteApproval,
} from "./approval-mutations.service";
export type {
  UpdateApprovalData,
  CreateApprovalData,
  ApprovalFilters,
  ApprovalWithRelations,
  ApprovalsResponse,
} from "@/types/approval";