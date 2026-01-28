/**
 * Bulk Delete Work Programs Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for bulk deleting work programs with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IWorkProgramRepository } from "@/application/interface/work-program.repository.interface";

/**
 * Result type for BulkDeleteWorkProgramsUseCase
 */
export interface BulkDeleteWorkProgramsResult {
  count: number;
}

/**
 * Bulk Delete Work Programs Use Case
 * Encapsulates the business logic for bulk deleting work programs with validation and activity logging.
 */
export class BulkDeleteWorkProgramsUseCase {
  constructor(private readonly workProgramRepository: IWorkProgramRepository) {}

  /**
   * Execute the use case
   * @param ids - Array of work program IDs to delete
   * @param user - User context for logging
   * @returns Promise resolving to deletion result
   */
  async execute(
    ids: string[],
    user: { id: string },
  ): Promise<BulkDeleteWorkProgramsResult> {
    // Validate IDs
    this.validateIds(ids);

    // Execute repository call
    const result = await this.workProgramRepository.bulkDeleteWorkPrograms(
      ids,
      user,
    );

    return result;
  }

  /**
   * Validate IDs array
   * @throws Error if validation fails
   */
  private validateIds(ids: string[]): void {
    const errors: string[] = [];

    // Check if array is valid
    if (!Array.isArray(ids) || ids.length === 0) {
      throw new Error("Invalid or missing IDs array");
    }

    // Filter and validate individual IDs
    const validIds = ids.filter(
      (id) => typeof id === "string" && id.trim() !== "" && id !== "undefined",
    );

    if (validIds.length === 0) {
      throw new Error("No valid IDs provided");
    }

    // Check for empty strings after trimming
    const emptyIds = ids.filter((id) => id.trim() === "");
    if (emptyIds.length > 0) {
      errors.push("Some IDs are empty strings");
    }

    // Check for undefined values
    const undefinedIds = ids.filter((id) => id === "undefined");
    if (undefinedIds.length > 0) {
      errors.push("Some IDs are undefined");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
