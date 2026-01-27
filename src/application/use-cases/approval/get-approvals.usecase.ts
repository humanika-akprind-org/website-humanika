/**
 * Get Approvals Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching approvals with filtering and pagination.
 */

import type {
  ApprovalFilters,
  ApprovalsResponse,
} from "@/domain/entities/approval.entity";
import { getApprovals } from "@/infrastructure/repositories/approval/approval-queries.repository";

/**
 * Input for the get approvals use case
 */
export interface GetApprovalsInput extends ApprovalFilters {}

/**
 * Result of the get approvals use case
 */
export interface GetApprovalsResult {
  approvals: ApprovalsResponse["approvals"];
  pagination: ApprovalsResponse["pagination"];
}

/**
 * Get Approvals Use Case
 *
 * This use case fetches approvals with:
 * - Filtering by status, entityType
 * - Pagination support
 * - Ordering by created date
 *
 * Use this when you need:
 * - Complex read operations with business logic
 * - Filtering and pagination for approvals
 * - Consistent response format
 */
export class GetApprovalsUseCase {
  /**
   * Execute the use case to get approvals
   *
   * @param input - Filter and pagination parameters
   * @returns Paginated approvals with metadata
   */
  async execute(input: GetApprovalsInput): Promise<GetApprovalsResult> {
    // Set defaults
    const page = input.page || 1;
    const limit = input.limit || 10;

    // Validate inputs
    if (page < 1) {
      throw new Error("Page must be greater than 0");
    }

    if (limit < 1 || limit > 100) {
      throw new Error("Limit must be between 1 and 100");
    }

    // Execute the repository function
    const result = await getApprovals({
      status: input.status,
      entityType: input.entityType,
      page,
      limit,
    });

    return {
      approvals: result.approvals,
      pagination: result.pagination,
    };
  }
}
