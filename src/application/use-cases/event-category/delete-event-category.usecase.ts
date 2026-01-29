/**
 * Delete Event Category Use Case - Write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting an event category.
 * Use this for write operations that require validation, logging, and error handling.
 */

import type { IEventCategoryRepository } from "@/application/interface/event-category.repository.interface";

export class DeleteEventCategoryUseCase {
  constructor(private eventCategoryRepo: IEventCategoryRepository) {}

  /**
   * Execute the use case to delete an event category
   *
   * @param id - The ID of the category to delete
   * @param userId - The ID of the user performing the deletion
   * @throws Error if category is not found
   */
  async execute(id: string, userId: string): Promise<void> {
    // 1. Verify category exists (repository will throw if not found)
    await this.eventCategoryRepo.findById(id);

    // 2. Delete the category
    await this.eventCategoryRepo.delete(id, userId);
  }
}
