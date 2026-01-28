/**
 * Get User By ID Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for fetching a single user by ID.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";
import type { User } from "@/application/interface/user.repository.interface";

/**
 * Get User By ID Use Case
 */
export class GetUserByIdUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param id - User ID
   * @returns Promise resolving to user or null
   */
  async execute(id: string): Promise<User | null> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("User ID is required");
    }

    // Execute repository call
    const user = await this.userRepository.getUserById(id.trim());

    return user;
  }
}
