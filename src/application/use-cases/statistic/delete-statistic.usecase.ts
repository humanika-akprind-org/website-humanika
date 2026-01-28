/**
 * Delete Statistic Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles deleting statistics with:
 * - Existence checking
 * - Activity logging
 */

import type { IStatisticRepository } from "@/application/interface/statistic.repository.interface";
import type { Statistic } from "@/domain/entities/statistic.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<{ id: string }, "id">;

export class DeleteStatisticUseCase {
  constructor(private statisticRepo: IStatisticRepository) {}

  /**
   * Execute the use case to delete a statistic
   *
   * @param id - Statistic ID
   * @param user - The user deleting the statistic
   */
  async execute(id: string, user: UserWithId): Promise<void> {
    // 1. Check if statistic exists
    const existingStatistic = await this.statisticRepo.findById(id);
    if (!existingStatistic) {
      throw new Error("Statistic not found");
    }

    // 2. Delete the statistic
    await this.statisticRepo.delete(id, user.id);

    // 3. Log activity
    await this.logDeletion(user, existingStatistic);
  }

  /**
   * Log the statistic deletion activity
   */
  private async logDeletion(
    user: UserWithId,
    statistic: Statistic,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.DELETE,
      entityType: "Statistic",
      entityId: statistic.id,
      description: `Deleted statistic for period`,
      metadata: {
        oldData: {
          activeMembers: statistic.activeMembers,
          annualEvents: statistic.annualEvents,
          collaborativeProjects: statistic.collaborativeProjects,
          innovationProjects: statistic.innovationProjects,
          awards: statistic.awards,
          memberSatisfaction: statistic.memberSatisfaction,
          learningMaterials: statistic.learningMaterials,
          periodId: statistic.periodId,
        },
        newData: null,
      },
    });
  }
}
