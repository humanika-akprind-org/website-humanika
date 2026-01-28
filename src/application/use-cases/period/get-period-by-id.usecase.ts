/**
 * Get Period By ID Use Case - Simple read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single period by ID.
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period } from "@/domain/entities/period.entity";

export class GetPeriodByIdUseCase {
  constructor(private periodRepo: IPeriodRepository) {}

  /**
   * Execute the use case to get a period by ID
   *
   * @param id - Period ID
   * @returns The period or null if not found
   */
  async execute(id: string): Promise<Period | null> {
    return this.periodRepo.findById(id);
  }
}
