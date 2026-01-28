/**
 * Get Statistic By ID Use Case - Simple read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching a single statistic by ID.
 */

import type { IStatisticRepository } from "@/application/interface/statistic.repository.interface";
import type { Statistic } from "@/domain/entities/statistic.entity";

export class GetStatisticByIdUseCase {
  constructor(private statisticRepo: IStatisticRepository) {}

  /**
   * Execute the use case to get a statistic by ID
   *
   * @param id - Statistic ID
   * @returns The statistic or null if not found
   */
  async execute(id: string): Promise<Statistic | null> {
    return this.statisticRepo.findById(id);
  }
}
