/**
 * Create Event Category Use Case - Write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating a new event category.
 * Use this for write operations that require validation, logging, and error handling.
 */

import type { IEventCategoryRepository } from "@/application/interface/event-category.repository.interface";
import type {
  EventCategory,
  CreateEventCategoryInput,
} from "@/domain/value-objects/event-category";

export class CreateEventCategoryUseCase {
  constructor(private eventCategoryRepo: IEventCategoryRepository) {}

  /**
   * Execute the use case to create a new event category
   *
   * @param input - The input data for creating the category
   * @param userId - The ID of the user creating the category
   * @returns The created event category
   * @throws Error if validation fails or category already exists
   */
  async execute(
    input: CreateEventCategoryInput,
    userId: string,
  ): Promise<EventCategory> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicate name
    await this.checkForDuplicate(input.name);

    // 3. Create the category
    const category = await this.eventCategoryRepo.create(input, userId);

    return category;
  }

  /**
   * Validate that required fields are provided
   */
  private validateInput(input: CreateEventCategoryInput): void {
    const errors: string[] = [];

    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check if a category with the same name already exists
   */
  private async checkForDuplicate(name: string): Promise<void> {
    const existing = await this.eventCategoryRepo.findByName(name.trim());

    if (existing) {
      throw new Error("Event category with this name already exists");
    }
  }
}
