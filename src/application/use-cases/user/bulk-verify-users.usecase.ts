/**
 * Bulk Verify Users Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for bulk verification of users.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";

/**
 * Bulk Verify Users Use Case
 */
export class BulkVerifyUsersUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param userIds - Array of user IDs to verify
   * @returns Promise resolving to bulk operation result
   */
  async execute(userIds: string[]): Promise<{ count: number }> {
    // Validate input
    this.validateInput(userIds);

    // Execute repository call
    const result = await this.userRepository.bulkVerifyUsers(userIds);

    return result;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(userIds: string[]): void {
    const errors: string[] = [];

    if (!userIds || !Array.isArray(userIds) || userIds.length === 0) {
      errors.push("userIds array is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
