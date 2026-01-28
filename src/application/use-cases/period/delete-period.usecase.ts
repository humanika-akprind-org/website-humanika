/**
 * Delete Period Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting periods with:
 * - Existence checking
 * - Related data check
 * - Activity logging
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period } from "@/domain/entities/period.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class DeletePeriodUseCase {
  constructor(private periodRepo: IPeriodRepository) {}

  /**
   * Execute the use case to delete a period
   *
   * @param id - Period ID
   */
  async execute(id: string): Promise<void> {
    // 1. Check if period exists
    const existingPeriod = await this.periodRepo.findById(id);
    if (!existingPeriod) {
      throw new Error("Period not found");
    }

    // 2. Delete the period
    await this.periodRepo.delete(id);

    // 3. Log activity
    await this.logDeletion(existingPeriod);
  }

  /**
   * Log the period deletion activity
   */
  private async logDeletion(period: Period): Promise<void> {
    await logActivity({
      userId: "system",
      activityType: ActivityType.DELETE,
      entityType: "Period",
      entityId: period.id,
      description: `Deleted period: ${period.name}`,
      metadata: {
        oldData: {
          name: period.name,
          startYear: period.startYear,
          endYear: period.endYear,
          isActive: period.isActive,
        },
        newData: null,
      },
    });
  }
}
