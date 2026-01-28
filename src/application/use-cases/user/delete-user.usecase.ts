/**
 * Delete User Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for deleting users.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";

/**
 * Delete User Use Case
 */
export class DeleteUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param id - User ID
   * @returns Promise resolving when user is deleted
   */
  async execute(id: string): Promise<void> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("User ID is required");
    }

    // Execute repository call
    await this.userRepository.deleteUser(id.trim());
  }
}
