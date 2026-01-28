/**
 * Create Activity Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating activity logs with validation.
 */

import type { ActivityLog } from "@/domain/entities/activity-log.entity";
import type { ActivityType } from "@/domain/enums";
import type { IActivityRepository } from "@/application/interface/activity.repository.interface";

/**
 * Input for creating an activity
 */
export interface CreateActivityInput {
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: unknown;
}

/**
 * Context for activity creation (user info)
 */
export interface CreateActivityContext {
  id: string;
}

/**
 * Result of create activity use case
 */
export interface CreateActivityResult {
  activity: ActivityLog;
}

/**
 * Create Activity Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating activity logs with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */
export class CreateActivityUseCase {
  constructor(private readonly activityRepository: IActivityRepository) {}

  /**
   * Execute the use case
   * @param input - Activity creation input data
   * @param context - User context for the activity
   * @param ipAddress - IP address of the request
   * @param userAgent - User agent string
   * @returns Promise resolving to created activity log
   */
  async execute(
    input: CreateActivityInput,
    context: CreateActivityContext,
    ipAddress: string,
    userAgent: string,
  ): Promise<CreateActivityResult> {
    // Validate input
    this.validateInput(input);

    // Prepare data for repository
    const activityData = {
      activityType: input.activityType,
      entityType: input.entityType,
      entityId: input.entityId,
      description: input.description,
      metadata: input.metadata,
      ipAddress,
      userAgent,
    };

    // Execute repository call
    const activity = await this.activityRepository.create(
      activityData,
      context,
    );

    return { activity };
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateActivityInput): void {
    const errors: string[] = [];

    // Activity type validation
    if (!input.activityType) {
      errors.push("Activity type is required");
    }

    // Entity type validation
    if (!input.entityType || input.entityType.trim() === "") {
      errors.push("Entity type is required");
    }

    // Description validation
    if (!input.description || input.description.trim() === "") {
      errors.push("Description is required");
    } else if (input.description.length > 1000) {
      errors.push("Description must be less than 1000 characters");
    }

    // Entity ID validation (optional but if provided must be valid)
    if (input.entityId !== undefined && input.entityId.trim() === "") {
      errors.push("Entity ID cannot be empty if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
