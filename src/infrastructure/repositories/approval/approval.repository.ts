// Re-export everything from the modular services
export { getApprovals } from "./approval-queries.repository";
export {
  createApproval,
  updateApproval,
  deleteApproval,
} from "./approval-mutations.repository";
export type {
  UpdateApprovalData,
  CreateApprovalData,
  ApprovalFilters,
  ApprovalWithRelations,
  ApprovalsResponse,
} from "@/domain/entities/approval.entity";
