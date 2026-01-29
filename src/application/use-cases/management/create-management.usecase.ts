/**
 * Create Management Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating management positions with:
 * - Input validation
 * - Duplicate checking (user already has position in period)
 * - Position availability check (position in department not taken)
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IManagementRepository } from "@/application/interface/management.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class CreateManagementUseCase {
  constructor(private managementRepo: IManagementRepository) {}

  /**
   * Execute the use case to create a new management position
   *
   * @param input - Validated management input data
   * @param userId - The ID of the user creating the management position
   * @returns The created management
   */
  async execute(
    input: ManagementServerData,
    userId: string,
  ): Promise<Management> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates (user already has position in this period)
    await this.checkUserDuplicate(input);

    // 3. Check if position in department is already taken
    await this.checkPositionTaken(input);

    // 4. Create the management
    const management = await this.managementRepo.create(input, userId);

    // 5. Log activity
    await this.logCreation(userId, management);

    return management;
  }

  /**
   * Validate required fields for management creation
   */
  private validateInput(input: ManagementServerData): void {
    const errors: string[] = [];

    if (!input.userId || input.userId.trim() === "") {
      errors.push("User ID is required");
    }

    if (!input.periodId || input.periodId.trim() === "") {
      errors.push("Period ID is required");
    }

    if (!input.position) {
      errors.push("Position is required");
    }

    if (!input.department) {
      errors.push("Department is required");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Check if user already has a management position in this period
   */
  private async checkUserDuplicate(input: ManagementServerData): Promise<void> {
    const existingManagement = await this.managementRepo.findByUserAndPeriod(
      input.userId,
      input.periodId,
    );

    if (existingManagement) {
      throw new Error("User already has a management position in this period");
    }
  }

  /**
   * Check if position in department is already taken for this period
   */
  private async checkPositionTaken(input: ManagementServerData): Promise<void> {
    const existingPosition =
      await this.managementRepo.findByPositionAndDepartment(
        input.position,
        input.department,
        input.periodId,
      );

    if (existingPosition) {
      throw new Error(
        "This position in the department is already taken for this period",
      );
    }
  }

  /**
   * Log the management creation activity
   */
  private async logCreation(
    userId: string,
    management: Management,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType: ActivityType.CREATE,
      entityType: "Management",
      entityId: management.id,
      description: `Created management: ${management.user?.name || "Unknown"}`,
      metadata: {
        newData: {
          userId: management.userId,
          position: management.position,
          department: management.department,
          periodId: management.periodId,
          photo: management.photo,
        },
      },
    });
  }
}
