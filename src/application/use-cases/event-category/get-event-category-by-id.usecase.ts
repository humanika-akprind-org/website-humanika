/**
 * Get Event Category By ID Use Case - Read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single event category by ID.
 * Use this for read operations that require validation and error handling.
 */

import type { IEventCategoryRepository } from "@/application/interface/event-category.repository.interface";
import type { EventCategory } from "@/domain/value-objects/event-category";

export class GetEventCategoryByIdUseCase {
  constructor(private eventCategoryRepo: IEventCategoryRepository) {}

  /**
   * Execute the use case to get an event category by ID
   *
   * @param id - The ID of the category to fetch
   * @returns The event category
   * @throws Error if category is not found
   */
  async execute(id: string): Promise<EventCategory> {
    const category = await this.eventCategoryRepo.findById(id);

    if (!category) {
      throw new Error("Event category not found");
    }

    return category;
  }
}
