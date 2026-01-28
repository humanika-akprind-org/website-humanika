/**
 * Create Statistic Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating statistics with:
 * - Input validation
 * - Duplicate checking (same period)
 * - Activity logging
 *
 * Use this for complex write operations that require business logic.
 */

import type { IStatisticRepository } from "@/application/interface/statistic.repository.interface";
import type {
  CreateStatisticInput,
  Statistic,
} from "@/domain/entities/statistic.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type UserWithId = Pick<{ id: string }, "id">;

export class CreateStatisticUseCase {
  constructor(private statisticRepo: IStatisticRepository) {}

  /**
   * Execute the use case to create a new statistic
   *
   * @param input - Validated statistic input data
   * @param user - The user creating the statistic
   * @returns The created statistic
   */
  async execute(
    input: CreateStatisticInput,
    user: UserWithId,
  ): Promise<Statistic> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check for duplicates (same period)
    await this.checkDuplicate(input);

    // 3. Create the statistic
    const statistic = await this.statisticRepo.create(input, user.id);

    // 4. Log activity
    await this.logCreation(user, statistic);

    return statistic;
  }

  /**
   * Validate required fields for statistic creation
   */
  private validateInput(input: CreateStatisticInput): void {
    const errors: string[] = [];

    if (!input.periodId || input.periodId.trim() === "") {
      errors.push("Period ID is required");
    }

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
   * Check for duplicate statistic (same period)
   */
  private async checkDuplicate(input: CreateStatisticInput): Promise<void> {
    const existingStatistic = await this.statisticRepo.findByPeriodId(
      input.periodId,
    );
    if (existingStatistic) {
      throw new Error("A statistic for this period already exists");
    }
  }

  /**
   * Log the statistic creation activity
   */
  private async logCreation(
    user: UserWithId,
    statistic: Statistic,
  ): Promise<void> {
    await logActivity({
      userId: user.id,
      activityType: ActivityType.CREATE,
      entityType: "Statistic",
      entityId: statistic.id,
      description: `Created statistic for period`,
      metadata: {
        newData: {
          activeMembers: statistic.activeMembers,
          annualEvents: statistic.annualEvents,
          collaborativeProjects: statistic.collaborativeProjects,
          innovationProjects: statistic.innovationProjects,
          awards: statistic.awards,
          memberSatisfaction: statistic.memberSatisfaction,
          learningMaterials: statistic.learningMaterials,
          periodId: statistic.periodId,
        },
      },
    });
  }
}
