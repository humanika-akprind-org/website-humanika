/**
 * Delete Management Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting management positions with:
 * - ID validation
 * - Existence check
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IManagementRepository } from "@/application/interface/management.repository.interface";
import type { Management } from "@/domain/entities/management.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class DeleteManagementUseCase {
  constructor(private managementRepo: IManagementRepository) {}

  /**
   * Execute the use case to delete a management position
   *
   * @param id - The management ID
   * @param userId - The ID of the user deleting the management position
   */
  async execute(id: string, userId: string): Promise<void> {
    // 1. Validate ID format
    this.validateId(id);

    // 2. Check if management exists
    const existingManagement = await this.managementRepo.findById(id);
    if (!existingManagement) {
      throw new Error("Management not found");
    }

    // 3. Delete the management
    await this.managementRepo.delete(id, userId);

    // 4. Log activity
    await this.logDeletion(userId, existingManagement);
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
   * Log the deletion activity
   */
  private async logDeletion(
    userId: string,
    management: Management,
  ): Promise<void> {
    await logActivity({
      userId,
      activityType: ActivityType.DELETE,
      entityType: "Management",
      entityId: management.id,
      description: `Deleted management: ${management.user?.name || "Unknown"}`,
      metadata: {
        oldData: {
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
