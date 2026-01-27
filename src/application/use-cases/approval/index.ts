/**
 * Approval Use Cases Index
 * Part of Clean Architecture: Application Layer (Use Cases)
 */

// Export all approval use cases
export { GetApprovalsUseCase } from "./get-approvals.usecase";
export type {
  GetApprovalsInput,
  GetApprovalsResult,
} from "./get-approvals.usecase";

export { CreateApprovalUseCase } from "./create-approval.usecase";
export type {
  CreateApprovalInputValidated,
  CreateApprovalResult,
  UseCaseContext,
} from "./create-approval.usecase";

export { UpdateApprovalUseCase } from "./update-approval.usecase";
export type {
  UpdateApprovalInputValidated,
  UpdateApprovalResult,
} from "./update-approval.usecase";

export { DeleteApprovalUseCase } from "./delete-approval.usecase";
export type {
  DeleteApprovalInput,
  DeleteApprovalResult,
} from "./delete-approval.usecase";
