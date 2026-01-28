/**
 * Update Management Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating management positions with:
 * - Input validation
 * - Existence check
 * - Duplicate checking (if user or position changes)
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IManagementRepository } from "@/application/interface/management.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import type { User } from "@/domain/entities/user.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<User, "id">;

export class UpdateManagementUseCase {
  constructor(private managementRepo: IManagementRepository) {}

  /**
   * Execute the use case to update a management position
   *
   * @param id - The management ID
   * @param input - Validated management input data
   * @param user - The user updating the management position
   * @returns The updated management
   */
  async execute(
    id: string,
    input: ManagementServerData,
    user: UserWithId,
  ): Promise<Management> {
    // 1. Validate ID format
    this.validateId(id);

    // 2. Validate input
    this.validateInput(input);

    // 3. Check if management exists
    const existingManagement = await this.managementRepo.findById(id);
    if (!existingManagement) {
      throw new Error("Management not found");
    }

    // 4. Check for duplicates if user or period changed
    if (
      input.userId !== existingManagement.userId ||
      input.periodId !== existingManagement.periodId
    ) {
      await this.checkUserDuplicate(input);
    }

    // 5. Check if position in department is already taken (if changed)
    if (
      input.position !== existingManagement.position ||
      input.department !== existingManagement.department ||
      input.periodId !== existingManagement.periodId
    ) {
      await this.checkPositionTaken(input);
    }

    // 6. Update the management
    const management = await this.managementRepo.update(id, input);

    // 7. Log activity
    await this.logUpdate(user, existingManagement, management);

    return management;
  }

  /**
   * Validate ID format
   */
  private validateId(id: string): void {
    if (!id || id.trim() === "") {
      throw new Error("Management ID is required");
    }

    // UUID validation (basic format check)
    const uuidRegex =
      /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(id)) {
      throw new Error("Invalid management ID format");
    }
  }

  /**
   * Validate required fields for management update
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
   * Log the activity
   */
  private async logActivity(
    userId: string,
    activityType: ActivityType,
    entityType: string,
    entityId: string,
    description: string,
    metadata?: Record<string, unknown>,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    });
  }

  /**
   * Log the update activity
   */
  private async logUpdate(
    user: UserWithId,
    oldManagement: Management,
    newManagement: Management,
  ): Promise<void> {
    await this.logActivity(
      user.id,
      ActivityType.UPDATE,
      "Management",
      newManagement.id,
      `Updated management: ${newManagement.user?.name || "Unknown"}`,
      {
        oldData: {
          userId: oldManagement.userId,
          position: oldManagement.position,
          department: oldManagement.department,
          periodId: oldManagement.periodId,
        },
        newData: {
          userId: newManagement.userId,
          position: newManagement.position,
          department: newManagement.department,
          periodId: newManagement.periodId,
        },
      },
    );
  }
}
