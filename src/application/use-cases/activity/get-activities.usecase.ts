/**
 * Get Activities Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching activities with filtering and pagination.
 */

import type { ActivityLog } from "@/domain/entities/activity-log.entity";
import type {
  ActivityFilters,
  ActivityPaginationResult,
  IActivityRepository,
} from "@/application/interface/activity.repository.interface";

/**
 * Filter for querying activities
 */
export interface ActivityFilterInput {
  activityType?: string | "ALL";
  startDate?: string;
  endDate?: string;
}

/**
 * Pagination input
 */
export interface ActivityPaginationInput {
  page?: number;
  limit?: number;
}

/**
 * Result type for GetActivitiesUseCase
 */
export interface GetActivitiesResult {
  activities: ActivityLog[];
  pagination: ActivityPaginationResult;
}

/**
 * Get Activities Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching activities with filtering.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class GetActivitiesUseCase {
  constructor(private readonly activityRepository: IActivityRepository) {}

  /**
   * Execute the use case
   * @param filter - Filter criteria for activities
   * @param pagination - Pagination parameters
   * @returns Promise resolving to filtered activities with pagination info
   */
  async execute(
    filter?: ActivityFilterInput,
    pagination?: ActivityPaginationInput,
  ): Promise<GetActivitiesResult> {
    // Set default pagination values
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    // Sanitize and validate filter parameters
    const sanitizedFilter = this.sanitizeFilter(filter);

    // Execute repository call
    const result = await this.activityRepository.findMany(sanitizedFilter, {
      page,
      limit,
    });

    // Return structured result with pagination
    return {
      activities: result.activities,
      pagination: result.pagination,
    };
  }

  /**
   * Sanitize and validate filter parameters
   */
  private sanitizeFilter(
    filter?: ActivityFilterInput,
  ): ActivityFilters | undefined {
    if (!filter) return undefined;

    return {
      activityType: filter.activityType,
      startDate: filter.startDate?.trim() || undefined,
      endDate: filter.endDate?.trim() || undefined,
    };
  }
}
