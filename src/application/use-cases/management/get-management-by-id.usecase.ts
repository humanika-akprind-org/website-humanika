/**
 * Get Management By ID Use Case - Single read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single management by ID.
 * Use this for read operations that require validation and error handling.
 */

import type { IManagementRepository } from "@/application/interface/management.repository.interface";
import type { Management } from "@/domain/entities/management.entity";

export class GetManagementByIdUseCase {
  constructor(private managementRepo: IManagementRepository) {}

  /**
   * Execute the use case to get a management by ID
   *
   * @param id - The management ID
   * @returns The management if found
   * @throws Error if management not found
   */
  async execute(id: string): Promise<Management> {
    // Validate ID format (basic check)
    if (!id || id.trim() === "") {
      throw new Error("Management ID is required");
    }

    // UUID validation (basic format check)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("Invalid management ID format");
    }

    const management = await this.managementRepo.findById(id);

    if (!management) {
      throw new Error("Management not found");
    }

    return management;
  }
}
