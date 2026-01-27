/**
 * Get Event By Slug Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single event by its slug.
 * Use this for read operations that require validation and error handling.
 */

import type { IEventRepository } from "@/application/interface/event.repository.interface";
import type { Event } from "@/domain/entities/event.entity";

export class GetEventBySlugUseCase {
  constructor(private eventRepo: IEventRepository) {}

  /**
   * Execute the use case to get an event by slug
   *
   * @param slug - The URL-friendly slug of the event
   * @returns The event if found
   * @throws Error if slug is empty or event not found
   */
  async execute(slug: string): Promise<Event> {
    // 1. Validate slug
    this.validateSlug(slug);

    // 2. Fetch event from repository
    const event = await this.eventRepo.findBySlug(slug);

    // 3. Check if event exists
    if (!event) {
      throw new Error("Event not found");
    }

    return event;
  }

  /**
   * Validate that slug is provided and non-empty
   */
  private validateSlug(slug: string): void {
    if (!slug || slug.trim() === "") {
      throw new Error("Slug is required");
    }

    // Basic slug format validation (alphanumeric, hyphens only)
    if (!/^[a-z0-9-]+$/.test(slug)) {
      throw new Error("Invalid slug format");
    }
  }
}
