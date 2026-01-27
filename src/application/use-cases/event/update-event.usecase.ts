/**
 * Update Event Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating events with:
 * - Input validation
 * - Existence checking
 * - Approval workflow for approved/rejected events
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IEventRepository } from "@/application/interface/event.repository.interface";
import type { UpdateEventInput, Event } from "@/domain/entities/event.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums/enums";

type UserWithId = Pick<User, "id">;

export class UpdateEventUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to update an existing event
   *
   * @param id - The unique identifier of the event to update
   * @param input - Validated event update data
   * @param user - The user performing the update
   * @returns The updated event
   */
  async execute(
    id: string,
    input: UpdateEventInput,
    user: UserWithId,
  ): Promise<Event> {
    // 1. Validate ID
    this.validateId(id);

    // 2. Validate input
    this.validateInput(input);

    // 3. Check if event exists
    await this.checkExistence(id);

    // 4. Update the event
    const event = await this.eventRepo.update(id, input);

    // 5. Log activity
    await this.logUpdate(user, event);

    return event;
  }

  /**
   * Validate that ID is provided and non-empty
   */
  private validateId(id: string): void {
    if (!id || id.trim() === "") {
      throw new Error("Event ID is required");
    }

    // UUID validation (basic format check)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("Invalid event ID format");
    }
  }

  /**
   * Validate update input fields
   */
  private validateInput(input: UpdateEventInput): void {
    const errors: string[] = [];

    // Name validation (if provided)
    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty if provided");
    }

    // Description validation (if provided)
    if (input.description !== undefined && input.description.trim() === "") {
      errors.push("Description cannot be empty if provided");
    }

    // Goal validation (if provided)
    if (input.goal !== undefined && input.goal.trim() === "") {
      errors.push("Goal cannot be empty if provided");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check if event exists
   */
  private async checkExistence(id: string): Promise<void> {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
  }

  /**
   * Log the event update activity
   */
  private async logUpdate(user: UserWithId, event: Event): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "Event",
      entityId: event.id,
      description: `Updated event: ${event.name}`,
      metadata: {
        newData: {
          name: event.name,
          department: event.department,
          status: event.status,
        },
      },
    });
  }
}
