/**
 * Delete Approval Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting approvals with validation and logging.
 */

import type { NextRequest } from "next/server";
import { deleteApproval } from "@/infrastructure/repositories/approval/approval-mutations.repository";

/**
 * Context passed to use cases for additional information
 */
export interface UseCaseContext {
  userId: string;
  request?: NextRequest;
}

/**
 * Input for the delete approval use case
 */
export interface DeleteApprovalInput {
  /** Approval ID to delete */
  approvalId: string;
}

/**
 * Result of the delete approval use case
 */
export interface DeleteApprovalResult {
  success: boolean;
  message: string;
}

/**
 * Delete Approval Use Case
 *
 * This use case handles:
 * - Approval existence checking
 * - Activity logging
 * - Consistent error handling
 *
 * Use this when you need:
 * - Complex write operations with validation
 * - Audit trail and logging
 * - Deletion with proper authorization checks
 */
export class DeleteApprovalUseCase {
  /**
   * Execute the use case to delete an approval
   *
   * @param input - Approval ID to delete
   * @param context - Additional context (user info and request)
   * @returns Deletion result
   */
  async execute(
    input: DeleteApprovalInput,
    context: UseCaseContext,
  ): Promise<DeleteApprovalResult> {
    // Validate required fields
    if (!input.approvalId || input.approvalId.trim() === "") {
      throw new Error("Validation failed: Approval ID is required");
    }

    // Execute the repository function with user context
    // Note: deleteApproval requires a NextRequest for activity logging
    await deleteApproval(input.approvalId, context.userId, context.request!);

    return {
      success: true,
      message: "Approval deleted successfully",
    };
  }
}
