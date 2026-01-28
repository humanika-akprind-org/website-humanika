/**
 * Period Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for period data operations.
 * All repository implementations must implement these methods.
 */

import type { Period, PeriodFormData } from "@/domain/entities/period.entity";

// ============================================================================
// Repository Interface
// ============================================================================

export interface IPeriodRepository {
  /**
   * Get all periods
   *
   * @returns Array of all periods
   */
  findAll(): Promise<Period[]>;

  /**
   * Get a single period by ID
   *
   * @param id - Period ID
   * @returns The period or null if not found
   */
  findById(id: string): Promise<Period | null>;

  /**
   * Create a new period
   *
   * @param data - Period data
   * @returns The created period
   */
  create(data: PeriodFormData): Promise<Period>;

  /**
   * Update an existing period
   *
   * @param id - Period ID
   * @param data - Update data
   * @returns The updated period
   */
  update(id: string, data: Partial<PeriodFormData>): Promise<Period>;

  /**
   * Delete a period
   *
   * @param id - Period ID
   */
  delete(id: string): Promise<void>;
}
