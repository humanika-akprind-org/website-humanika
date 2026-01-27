/**
 * Get Event Categories Use Case - Read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching all event categories.
 * Use this for read operations that require validation and error handling.
 */

import type { IEventCategoryRepository } from "@/application/interface/event-category.repository.interface";
import type { EventCategory } from "@/domain/value-objects/event-category";

export class GetEventCategoriesUseCase {
  constructor(private eventCategoryRepo: IEventCategoryRepository) {}

  /**
   * Execute the use case to get all event categories
   *
   * @returns Array of event categories
   */
  async execute(): Promise<EventCategory[]> {
    // Fetch all categories from repository
    const categories = await this.eventCategoryRepo.findAll();

    return categories;
  }
}
