/**
 * Get Users For Verification Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for getting users for bulk verification email.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";

/**
 * Get Users For Verification Use Case
 */
export class GetUsersForVerificationUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param userIds - Array of user IDs
   * @returns Promise resolving to users for verification
   */
  async execute(userIds: string[]): Promise<
    Array<{
      id: string;
      email: string;
      name: string;
    }>
  > {
    // Validate input
    this.validateInput(userIds);

    // Execute repository call
    const users = await this.userRepository.getUsersForVerification(userIds);

    return users;
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
