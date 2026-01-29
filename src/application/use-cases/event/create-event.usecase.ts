/**
 * Create Event Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating events with:
 * - Input validation
 * - Duplicate checking (if needed)
 * - Approval record creation
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IEventRepository } from "@/application/interface/event.repository.interface";
import type { CreateEventInput, Event } from "@/domain/entities/event.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class CreateEventUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to create a new event
   *
   * @param input - Validated event input data
   * @param user - The user creating the event
   * @returns The created event
   */
  async execute(input: CreateEventInput, user: UserWithId): Promise<Event> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates (e.g., same name in same period)
    await this.checkDuplicate(input);

    // 3. Create the event
    const event = await this.eventRepo.create(input);

    // 4. Create approval record
    await this.eventRepo.createApproval(
      event.id,
      user.id,
      "Event created and pending approval",
    );

    // 5. Log activity
    await this.logCreation(user, event);

    return event;
  }

  /**
   * Validate required fields for event creation
   */
  private validateInput(input: CreateEventInput): void {
    const errors: string[] = [];

    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    }

    if (!input.department) {
      errors.push("Department is required");
    }

    if (!input.periodId) {
      errors.push("Period ID is required");
    }

    if (!input.responsibleId) {
      errors.push("Responsible ID is required");
    }

    if (!input.schedules || input.schedules.length === 0) {
      errors.push("At least one schedule is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check for duplicate events (same name in same period)
   */
  private async checkDuplicate(input: CreateEventInput): Promise<void> {
    const result = await this.eventRepo.findMany({
      periodId: input.periodId,
    });

    const duplicate = result.records.find(
      (event) => event.name.toLowerCase() === input.name.toLowerCase(),
    );

    if (duplicate) {
      throw new Error(
        "An event with this name already exists in the selected period",
      );
    }
  }

  /**
   * Log the event creation activity
   */
  private async logActivity(
    userId: string,
    activityType: ActivityType,
    entityType: string,
    entityId: string,
    description: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    });
  }

  /**
   * Log the creation activity
   */
  private async logCreation(user: UserWithId, event: Event): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.CREATE,
      "Event",
      event.id,
      `Created event: ${event.name}`,
      {
        newData: {
          name: event.name,
          department: event.department,
          periodId: event.periodId,
          responsibleId: event.responsibleId,
          schedules: event.schedules,
        },
      },
    );
  }
}
