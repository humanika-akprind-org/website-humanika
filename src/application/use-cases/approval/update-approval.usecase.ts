/**
 * Update Approval Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating approvals with validation, logging,
 * and entity status synchronization.
 */

import type { NextRequest } from "next/server";
import type {
  UpdateApprovalData,
  ApprovalWithRelations,
} from "@/domain/entities/approval.entity";
import { updateApproval } from "@/infrastructure/repositories/approval/approval-mutations.repository";

/**
 * Context passed to use cases for additional information
 */
export interface UseCaseContext {
  userId: string;
  request?: NextRequest;
}

/**
 * Input for the update approval use case
 */
export interface UpdateApprovalInputValidated extends UpdateApprovalData {
  /** Approval ID */
  approvalId: string;
}

/**
 * Result of the update approval use case
 */
export interface UpdateApprovalResult {
  approval: ApprovalWithRelations;
}

/**
 * Update Approval Use Case
 *
 * This use case handles:
 * - Input validation
 * - Approval existence checking
 * - Activity logging
 * - Entity status synchronization on approval/rejection/cancellation
 * - Consistent error handling
 *
 * Use this when you need:
 * - Complex write operations with validation
 * - Audit trail and logging
 * - Status workflow management
 */
export class UpdateApprovalUseCase {
  /**
   * Execute the use case to update an approval
   *
   * @param input - Validated approval update data
   * @param context - Additional context (user info and request)
   * @returns Updated approval with relations
   */
  async execute(
    input: UpdateApprovalInputValidated,
    context: UseCaseContext,
  ): Promise<UpdateApprovalResult> {
    // Validate required fields
    if (!input.approvalId || input.approvalId.trim() === "") {
      throw new Error("Validation failed: Approval ID is required");
    }

    if (!input.status) {
      throw new Error("Validation failed: Status is required");
    }

    // Execute the repository function with user context
    // Note: updateApproval requires a NextRequest for activity logging
    const approval = await updateApproval(
      input.approvalId,
      {
        status: input.status,
        note: input.note,
      },
      context.userId,
      context.request!,
    );

    return {
      approval,
    };
  }
}
