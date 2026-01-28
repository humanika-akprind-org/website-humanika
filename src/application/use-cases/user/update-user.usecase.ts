/**
 * Update User Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for updating users with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  IUserRepository,
  UpdateUserInput,
} from "@/application/interface/user.repository.interface";
import type { User } from "@/application/interface/user.repository.interface";

/**
 * Update User Use Case
 */
export class UpdateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param id - User ID
   * @param input - User update input data
   * @returns Promise resolving to updated user
   */
  async execute(id: string, input: UpdateUserInput): Promise<User> {
    // Validate ID
    if (!id || id.trim() === "") {
      throw new Error("User ID is required");
    }

    // Validate input
    this.validateInput(input);

    // Execute repository call
    const user = await this.userRepository.updateUser(id.trim(), input);

    return user;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: UpdateUserInput): void {
    const errors: string[] = [];

    // Name validation (optional field)
    if (input.name !== undefined && input.name.trim() === "") {
      errors.push("Name cannot be empty if provided");
    } else if (input.name && input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Email validation (optional field)
    if (input.email !== undefined && input.email.trim() === "") {
      errors.push("Email cannot be empty if provided");
    } else if (input.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      errors.push("Invalid email format");
    }

    // Username validation (optional field)
    if (input.username !== undefined && input.username.trim() === "") {
      errors.push("Username cannot be empty if provided");
    } else if (
      input.username &&
      (input.username.length < 3 || !/^[a-zA-Z0-9_]+$/.test(input.username))
    ) {
      errors.push(
        "Username must be at least 3 characters and can only contain letters, numbers, and underscores",
      );
    }

    // Password validation (optional field)
    if (input.password !== undefined && input.password.length < 6) {
      errors.push("Password must be at least 6 characters if provided");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
