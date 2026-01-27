/**
 * Create Approval Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating approvals with validation, logging,
 * and duplicate checking.
 */

import type { NextRequest } from "next/server";
import type {
  CreateApprovalInput,
  ApprovalWithRelations,
} from "@/domain/entities/approval.entity";
import { createApproval } from "@/infrastructure/repositories/approval/approval-mutations.repository";

/**
 * Context passed to use cases for additional information
 */
export interface UseCaseContext {
  userId: string;
  request?: NextRequest;
}

/**
 * Input for the create approval use case
 */
export interface CreateApprovalInputValidated extends CreateApprovalInput {
  /** User ID of the requester */
  requesterId: string;
}

/**
 * Result of the create approval use case
 */
export interface CreateApprovalResult {
  approval: ApprovalWithRelations;
}

/**
 * Create Approval Use Case
 *
 * This use case handles:
 * - Input validation
 * - Duplicate approval checking
 * - Activity logging
 * - Consistent error handling
 *
 * Use this when you need:
 * - Complex write operations with validation
 * - Audit trail and logging
 * - Approval workflow management
 */
export class CreateApprovalUseCase {
  /**
   * Execute the use case to create an approval
   *
   * @param input - Validated approval data
   * @param context - Additional context (user info and request)
   * @returns Created approval with relations
   */
  async execute(
    input: CreateApprovalInputValidated,
    context: UseCaseContext,
  ): Promise<CreateApprovalResult> {
    // Validate required fields
    if (!input.entityType) {
      throw new Error("Validation failed: Entity type is required");
    }

    if (!input.entityId || input.entityId.trim() === "") {
      throw new Error("Validation failed: Entity ID is required");
    }

    if (!input.userId || input.userId.trim() === "") {
      throw new Error("Validation failed: User ID is required");
    }

    // Execute the repository function with user context
    // Note: createApproval requires a NextRequest for activity logging
    const approval = await createApproval(
      {
        entityType: input.entityType,
        entityId: input.entityId,
        userId: input.userId,
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
