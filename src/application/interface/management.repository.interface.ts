/**
 * Management Repository Interface - Entity-specific repository
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface extends IBaseRepository with Management-specific operations.
 */

import type { IBaseRepository } from "./base.repository.interface";
import type {
  Management,
  ManagementServerData,
} from "@/domain/entities/management.entity";
import type { Department, Position } from "@/domain/enums";

// Extend the base interface for Management entity
export interface IManagementRepository extends IBaseRepository<
  Management,
  string,
  ManagementServerData,
  ManagementServerData
> {
  // Management-specific methods (if any)

  /** Find managements with filters and pagination */
  findMany(
    filters?: ManagementFilters,
    pagination?: ManagementPagination,
  ): Promise<{
    managements: Management[];
    pagination: ManagementPaginationResult;
  }>;

  /** Find management by user ID and period ID */
  findByUserAndPeriod(
    userId: string,
    periodId: string,
  ): Promise<Management | null>;

  /** Find management by position and department in a period */
  findByPositionAndDepartment(
    position: Position,
    department: Department,
    periodId: string,
  ): Promise<Management | null>;

  /** Update management photo */
  updatePhoto(id: string, photo: string): Promise<Management>;
}

// Filter types for Management queries
export interface ManagementFilters {
  department?: Department;
  position?: Position;
  periodId?: string;
  search?: string;
  userId?: string;
}

// Pagination input
export interface ManagementPagination {
  page?: number;
  limit?: number;
}

// Pagination result
export interface ManagementPaginationResult {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
