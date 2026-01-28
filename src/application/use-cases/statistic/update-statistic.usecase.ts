/**
 * Update Statistic Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating statistics with:
 * - Input validation
 * - Activity logging
 */

import type { IStatisticRepository } from "@/application/interface/statistic.repository.interface";
import type {
  Statistic,
  UpdateStatisticInput,
} from "@/domain/entities/statistic.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<{ id: string }, "id">;

type PartialStatisticInput = Partial<UpdateStatisticInput>;

export class UpdateStatisticUseCase {
  constructor(private statisticRepo: IStatisticRepository) {}

  /**
   * Execute the use case to update a statistic
   *
   * @param id - Statistic ID
   * @param input - Validated statistic update data
   * @param user - The user updating the statistic
   * @returns The updated statistic
   */
  async execute(
    id: string,
    input: PartialStatisticInput,
    user: UserWithId,
  ): Promise<Statistic> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check if statistic exists
    const existingStatistic = await this.statisticRepo.findById(id);
    if (!existingStatistic) {
      throw new Error("Statistic not found");
    }

    // 3. Update the statistic
    const statistic = await this.statisticRepo.update(id, input, user.id);

    // 4. Log activity
    await this.logUpdate(user, existingStatistic, statistic);

    return statistic;
  }

  /**
   * Validate optional fields for statistic update
   */
  private validateInput(input: PartialStatisticInput): void {
    const errors: string[] = [];

    // Validate numeric fields are non-negative
    if (input.activeMembers !== undefined && input.activeMembers < 0) {
      errors.push("Active members cannot be negative");
    }

    if (input.annualEvents !== undefined && input.annualEvents < 0) {
      errors.push("Annual events cannot be negative");
    }

    if (
      input.collaborativeProjects !== undefined &&
      input.collaborativeProjects < 0
    ) {
      errors.push("Collaborative projects cannot be negative");
    }

    if (
      input.innovationProjects !== undefined &&
      input.innovationProjects < 0
    ) {
      errors.push("Innovation projects cannot be negative");
    }

    if (input.awards !== undefined && input.awards < 0) {
      errors.push("Awards cannot be negative");
    }

    if (
      input.memberSatisfaction !== undefined &&
      (input.memberSatisfaction < 0 || input.memberSatisfaction > 100)
    ) {
      errors.push("Member satisfaction must be between 0 and 100");
    }

    if (input.learningMaterials !== undefined && input.learningMaterials < 0) {
      errors.push("Learning materials cannot be negative");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Log the statistic update activity
   */
  private async logUpdate(
    user: UserWithId,
    oldStatistic: Statistic,
    newStatistic: Statistic,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.UPDATE,
      entityType: "Statistic",
      entityId: newStatistic.id,
      description: `Updated statistic for period`,
      metadata: {
        oldData: {
          activeMembers: oldStatistic.activeMembers,
          annualEvents: oldStatistic.annualEvents,
          collaborativeProjects: oldStatistic.collaborativeProjects,
          innovationProjects: oldStatistic.innovationProjects,
          awards: oldStatistic.awards,
          memberSatisfaction: oldStatistic.memberSatisfaction,
          learningMaterials: oldStatistic.learningMaterials,
        },
        newData: {
          activeMembers: newStatistic.activeMembers,
          annualEvents: newStatistic.annualEvents,
          collaborativeProjects: newStatistic.collaborativeProjects,
          innovationProjects: newStatistic.innovationProjects,
          awards: newStatistic.awards,
          memberSatisfaction: newStatistic.memberSatisfaction,
          learningMaterials: newStatistic.learningMaterials,
        },
      },
    });
  }
}
