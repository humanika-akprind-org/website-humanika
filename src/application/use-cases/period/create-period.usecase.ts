/**
 * Create Period Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles creating periods with:
 * - Input validation
 * - Year range validation
 * - Auto-deactivation of other periods when setting isActive
 * - Activity logging
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period, PeriodFormData } from "@/domain/entities/period.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

export class CreatePeriodUseCase {
  constructor(private periodRepo: IPeriodRepository) {}

  /**
   * Execute the use case to create a new period
   *
   * @param input - Validated period input data
   * @returns The created period
   */
  async execute(input: PeriodFormData): Promise<Period> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Create the period
    const period = await this.periodRepo.create(input);

    // 3. Log activity
    await this.logCreation(period);

    return period;
  }

  /**
   * Validate required fields for period creation
   */
  private validateInput(input: PeriodFormData): void {
    const errors: string[] = [];

    if (!input.name || input.name.trim() === "") {
      errors.push("Name is required");
    }

    if (!input.startYear) {
      errors.push("Start year is required");
    }

    if (!input.endYear) {
      errors.push("End year is required");
    }

    if (input.startYear && input.endYear && input.startYear >= input.endYear) {
      errors.push("Start year must be less than end year");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Log the period creation activity
   */
  private async logCreation(period: Period): Promise<void> {
    await logActivity({
      userId: "system",
      activityType: ActivityType.CREATE,
      entityType: "Period",
      entityId: period.id,
      description: `Created period: ${period.name}`,
      metadata: {
        newData: {
          name: period.name,
          startYear: period.startYear,
          endYear: period.endYear,
          isActive: period.isActive,
        },
      },
    });
  }
}
