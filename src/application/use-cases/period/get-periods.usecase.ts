/**
 * Get Periods Use Case - Simple read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching all periods.
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period } from "@/domain/entities/period.entity";

interface PeriodsResult {
  periods: Period[];
}

export class GetPeriodsUseCase {
  constructor(private periodRepo: IPeriodRepository) {}

  /**
   * Execute the use case to get all periods
   *
   * @returns All periods
   */
  async execute(): Promise<PeriodsResult> {
    const periods = await this.periodRepo.findAll();
    return { periods };
  }
}
