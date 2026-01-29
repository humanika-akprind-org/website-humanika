/**
 * Activity Repository Interface
 * Part of Clean Architecture: Application Layer (Interface)
 *
 * This interface defines the contract for activity data access operations.
 */

import type {
  BaseFilter,
  BasePagination,
  BasePaginationResult,
} from "./base.repository.interface";
import type { ActivityLog } from "@/domain/entities/activity-log.entity";
import type { UserRole, Department } from "@/domain/enums";

/**
 * Radar chart data structure for department activity visualization
 */
export interface DepartmentActivityData {
  department: Department;
  count: number;
}

/**
 * Radar chart result structure
 */
export interface RadarChartResult {
  subject: string;
  A: number;
  fullMark: number;
}

/**
 * Filters for querying activities
 */
export interface ActivityFilters extends BaseFilter {
  activityType?: string | "ALL";
  startDate?: string;
  endDate?: string;
}

/**
 * Activity Repository Interface
 *
 * Defines the contract for activity data access operations
 * following Clean Architecture principles.
 */
export interface IActivityRepository {
  /**
   * Get all activities with optional filters and pagination
   */
  findMany(
    filters?: ActivityFilters,
    pagination?: BasePagination,
  ): Promise<{
    activities: ActivityLog[];
    pagination: BasePaginationResult;
  }>;

  /**
   * Get activities for radar chart visualization
   * Filters by specific roles and aggregates by department
   */
  getActivitiesForRadarChart(
    allowedRoles: UserRole[],
    allowedDepartments: Department[],
  ): Promise<RadarChartResult[]>;

  /**
   * Find activity by ID
   */
  findById(id: string): Promise<ActivityLog | null>;

  /**
   * Get activities by user ID
   */
  findByUserId(userId: string): Promise<ActivityLog[]>;

  /**
   * Get activities by entity
   */
  findByEntity(entityType: string, entityId: string): Promise<ActivityLog[]>;

  /**
   * Create a new activity log
   */
  create(
    data: {
      activityType: string;
      entityType: string;
      entityId?: string;
      description: string;
      metadata?: unknown;
      ipAddress: string;
      userAgent: string;
    },
    user: { id: string },
  ): Promise<ActivityLog>;

  /**
   * Delete activity by ID
   */
  delete(id: string): Promise<void>;
}
