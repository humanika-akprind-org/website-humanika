/**
 * Get Event By ID Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single event by its ID.
 * Use this for read operations that require validation and error handling.
 */

import type { IEventRepository } from "@/application/interface/event.repository.interface";
import type { Event } from "@/domain/entities/event.entity";

export class GetEventByIdUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to get an event by ID
   *
   * @param id - The unique identifier of the event
   * @returns The event if found
   * @throws Error if ID is empty or event not found
   */
  async execute(id: string): Promise<Event> {
    // 1. Validate ID
    this.validateId(id);

    // 2. Fetch event from repository
    const event = await this.eventRepo.findById(id);

    // 3. Check if event exists
    if (!event) {
      throw new Error("Event not found");
    }

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
}
