/**
 * Create User Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 *
 * Encapsulates the business logic for creating users with validation.
 * Following Single Responsibility Principle - one use case per operation.
 */

import type {
  IUserRepository,
  CreateUserInput,
  User,
} from "@/application/interface/user.repository.interface";

/**
 * Create User Use Case
 */
export class CreateUserUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  /**
   * Execute the use case
   * @param input - User creation input data
   * @param user - User context for logging
   * @returns Promise resolving to created user
   */
  async execute(input: CreateUserInput, _user: { id: string }): Promise<User> {
    // Validate input
    this.validateInput(input);

    // Execute repository call
    const user = await this.userRepository.createUser(input);

    return user;
  }

  /**
   * Validate input data
   * @throws Error if validation fails
   */
  private validateInput(input: CreateUserInput): void {
    const errors: string[] = [];

    // Name validation
    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    } else if (input.name.length < 2) {
      errors.push("Name must be at least 2 characters");
    } else if (input.name.length > 255) {
      errors.push("Name must be less than 255 characters");
    }

    // Email validation
    if (!input.email || input.email.trim() === "") {
      errors.push("Email is required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      errors.push("Invalid email format");
    }

    // Username validation
    if (!input.username || input.username.trim() === "") {
      errors.push("Username is required");
    } else if (input.username.length < 3) {
      errors.push("Username must be at least 3 characters");
    } else if (!/^[a-zA-Z0-9_]+$/.test(input.username)) {
      errors.push(
        "Username can only contain letters, numbers, and underscores",
      );
    }

    // Password validation
    if (!input.password || input.password.trim() === "") {
      errors.push("Password is required");
    } else if (input.password.length < 6) {
      errors.push("Password must be at least 6 characters");
    }

    // Throw validation error if there are any errors
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
