/**
 * Update Period Use Case - Complex write operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles updating periods with:
 * - Input validation
 * - Year range validation
 * - Activity logging
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period, PeriodFormData } from "@/domain/entities/period.entity";
import { logActivity } from "@/presentation/lib/activity-log";
import { ActivityType } from "@/domain/enums";

type PartialPeriodFormData = Partial<PeriodFormData>;

export class UpdatePeriodUseCase {
  constructor(private periodRepo: IPeriodRepository) {}

  /**
   * Execute the use case to update a period
   *
   * @param id - Period ID
   * @param input - Validated period update data
   * @returns The updated period
   */
  async execute(id: string, input: PartialPeriodFormData): Promise<Period> {
    // 1. Validate input
    this.validateInput(input);

    // 2. Check if period exists
    const existingPeriod = await this.periodRepo.findById(id);
    if (!existingPeriod) {
      throw new Error("Period not found");
    }

    // 3. Update the period
    const period = await this.periodRepo.update(id, input);

    // 4. Log activity
    await this.logUpdate(existingPeriod, period);

    return period;
  }

  /**
   * Validate optional fields for period update
   */
  private validateInput(input: PartialPeriodFormData): void {
    const errors: string[] = [];

    // Validate year range if both are provided
    if (
      input.startYear !== undefined &&
      input.endYear !== undefined &&
      input.startYear >= input.endYear
    ) {
      errors.push("Start year must be less than end year");
    }

    if (errors.length > 0) {
      throw new Error(`Validation failed: ${errors.join(", ")}`);
    }
  }

  /**
   * Log the period update activity
   */
  private async logUpdate(oldPeriod: Period, newPeriod: Period): Promise<void> {
    await logActivity({
      userId: "system",
      activityType: ActivityType.UPDATE,
      entityType: "Period",
      entityId: newPeriod.id,
      description: `Updated period: ${newPeriod.name}`,
      metadata: {
        oldData: {
          name: oldPeriod.name,
          startYear: oldPeriod.startYear,
          endYear: oldPeriod.endYear,
          isActive: oldPeriod.isActive,
        },
        newData: {
          name: newPeriod.name,
          startYear: newPeriod.startYear,
          endYear: newPeriod.endYear,
          isActive: newPeriod.isActive,
        },
      },
    });
  }
}
