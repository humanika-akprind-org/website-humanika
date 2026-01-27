/**
 * Update Event Category Use Case - Write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating an existing event category.
 * Use this for write operations that require validation, logging, and error handling.
 */

import type { IEventCategoryRepositoryExtended } from "@/application/interface/event-category.repository.interface";
import type {
  EventCategory,
  UpdateEventCategoryInput,
} from "@/domain/value-objects/event-category";

export class UpdateEventCategoryUseCase {
  constructor(private eventCategoryRepo: IEventCategoryRepositoryExtended) {}

  /**
   * Execute the use case to update an event category
   *
   * @param id - The ID of the category to update
   * @param input - The input data for updating the category
   * @param userId - The ID of the user performing the update
   * @returns The updated event category
   * @throws Error if validation fails or category is not found
   */
  async execute(
    id: string,
    input: UpdateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicate name (if name is being updated)
    if (input.name) {
      await this.checkForDuplicateName(id, input.name);
    }

    // 3. Update the category
    const category = await this.eventCategoryRepo.update(id, input, userId);

    return category;
  }

  /**
   * Validate that required fields are provided
   */
  private validateInput(input: UpdateEventCategoryInput): void {
    const errors: string[] = [];

    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check if another category with the same name already exists
   */
  private async checkForDuplicateName(
    currentId: string,
    name: string,
  ): Promise<void> {
    const existing = await this.eventCategoryRepo.findByName(name.trim());

    if (existing && existing.id !== currentId) {
      throw new Error("Event category with this name already exists");
    }
  }
}
