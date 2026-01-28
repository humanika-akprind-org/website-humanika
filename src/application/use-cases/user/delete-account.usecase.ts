/**
 * Delete Account Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for user self-deletion of account.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";

/**
 * Delete Account Use Case
 */
export class DeleteAccountUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param userId - User ID
   * @returns Promise resolving when account is deleted
   */
  async execute(userId: string): Promise<void> {
    // Validate ID
    if (!userId || userId.trim() === "") {
      throw new Error("User ID is required");
    }

    // Execute repository call
    await this.userRepository.deleteAccount(userId.trim());
  }
}
