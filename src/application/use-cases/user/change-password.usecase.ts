/**
 * Change Password Use Case
 * Part of Clean Architecture: Application Layer (Use Case)
 */

import type { IUserRepository } from "@/application/interface/user.repository.interface";

export class ChangePasswordUseCase {
  constructor(private readonly userRepository: IUserRepository) {}

  async execute(
    userId: string,
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    this.validateInput(currentPassword, newPassword);
    await this.userRepository.changePassword(
      userId,
      currentPassword,
      newPassword,
    );
  }

  private validateInput(currentPassword: string, newPassword: string): void {
    const errors: string[] = [];
    if (!currentPassword || currentPassword.trim() === "") {
      errors.push("Current password is required");
    }
    if (!newPassword || newPassword.trim() === "") {
      errors.push("New password is required");
    } else if (newPassword.length < 6) {
      errors.push("New password must be at least 6 characters");
    }
    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }
}
