/**
 * Period Repository Prisma Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * This repository wraps existing period functions
 * and implements the IPeriodRepository interface.
 */

import type { IPeriodRepository } from "@/application/interface/period.repository.interface";
import type { Period, PeriodFormData } from "@/domain/entities/period.entity";
import {
  getPeriods,
  getPeriod,
  createPeriod,
  updatePeriod,
  deletePeriod,
} from "./index";

/**
 * Period Repository Prisma Implementation
 *
 * This class wraps existing repository functions to implement
 * the standardized repository interface for Clean Architecture.
 */
export class PeriodRepositoryPrisma implements IPeriodRepository {
  /**
   * Get all periods
   */
  async findAll(): Promise<Period[]> {
    return getPeriods();
  }

  /**
   * Get a single period by ID
   */
  async findById(id: string): Promise<Period | null> {
    return getPeriod(id);
  }

  /**
   * Create a new period
   */
  async create(data: PeriodFormData): Promise<Period> {
    return createPeriod(data);
  }

  /**
   * Update an existing period
   */
  async update(id: string, data: Partial<PeriodFormData>): Promise<Period> {
    return updatePeriod(id, data);
  }

  /**
   * Delete a period
   */
  async delete(id: string): Promise<void> {
    return deletePeriod(id);
  }
}
