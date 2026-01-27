/**
 * Delete Event Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting events with:
 * - Existence checking
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IEventRepository } from "@/application/interface/event.repository.interface";
import type { Event } from "@/domain/entities/event.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class DeleteEventUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to delete an event
   *
   * @param id - The unique identifier of the event to delete
   * @param user - The user performing the deletion
   * @returns void
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Validate ID
    this.validateId(id);

    // 2. Check if event exists and get event name for logging
    const event = await this.checkExistence(id);

    // 3. Delete the event
    await this.eventRepo.delete(id);

    // 4. Log activity
    await this.logDeletion(user, event);
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
   * Check if event exists
   */
  private async checkExistence(id: string): Promise<Event> {
    const event = await this.eventRepo.findById(id);
    if (!event) {
      throw new Error("Event not found");
    }
    return event;
  }

  /**
   * Log the event deletion activity
   */
  private async logDeletion(user: UserWithId, event: Event): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "Event",
      entityId: event.id,
      description: `Deleted event: ${event.name}`,
      metadata: {
        oldData: {
          name: event.name,
          department: event.department,
          status: event.status,
          schedules: event.schedules,
        },
        newData: null,
      },
    });
  }
}
