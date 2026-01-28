/**
 * Activity Repository Prisma - Implementation
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Implements IActivityRepository using Prisma ORM.
 * Following Dependency Inversion Principle - depends on abstraction.
 */

import type { ActivityLog } from "@/domain/entities/activity-log.entity";
import type {
  ActivityFilters,
  ActivityPagination,
  ActivityPaginationResult,
  RadarChartResult,
  IActivityRepository,
} from "@/application/interface/activity.repository.interface";
import {
  type UserRole,
  type Department,
  type ActivityType,
} from "@/domain/enums";
import {
  getActivities,
  createActivity,
  getActivityById,
  getActivitiesByUserId,
  getActivitiesByEntity,
  getActivitiesForRadarChart,
  deleteActivity,
} from "./index";

// Type alias for user context
type UserWithId = { id: string };

/**
 * Activity Repository Prisma Implementation
 */
export class ActivityRepositoryPrisma implements IActivityRepository {
  /**
   * Get all activities with optional filters and pagination
   */
  async findMany(
    filters?: ActivityFilters,
    pagination?: ActivityPagination,
  ): Promise<{
    activities: ActivityLog[];
    pagination: ActivityPaginationResult;
  }> {
    const page = pagination?.page || 1;
    const limit = pagination?.limit || 10;

    const result = await getActivities(
      {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        activityType: filters?.activityType as any,
        startDate: filters?.startDate,
        endDate: filters?.endDate,
      },
      { page, limit },
    );

    return result as {
      activities: ActivityLog[];
      pagination: ActivityPaginationResult;
    };
  }

  /**
   * Get activities for radar chart visualization
   * Filters by specific roles and aggregates by department
   */
  async getActivitiesForRadarChart(
    allowedRoles: UserRole[],
    allowedDepartments: Department[],
  ): Promise<RadarChartResult[]> {
    return await getActivitiesForRadarChart(allowedRoles, allowedDepartments);
  }

  /**
   * Find activity by ID
   */
  async findById(id: string): Promise<ActivityLog | null> {
    return (await getActivityById(id)) as ActivityLog | null;
  }

  /**
   * Get activities by user ID
   */
  async findByUserId(userId: string): Promise<ActivityLog[]> {
    return (await getActivitiesByUserId(userId)) as ActivityLog[];
  }

  /**
   * Get activities by entity
   */
  async findByEntity(
    entityType: string,
    entityId: string,
  ): Promise<ActivityLog[]> {
    return (await getActivitiesByEntity(entityType, entityId)) as ActivityLog[];
  }

  /**
   * Create a new activity log
   */
  async create(
    data: {
      activityType: string;
      entityType: string;
      entityId?: string;
      description: string;
      metadata?: unknown;
      ipAddress: string;
      userAgent: string;
    },
    user: UserWithId,
  ): Promise<ActivityLog> {
    return (await createActivity(
      {
        activityType: data.activityType as ActivityType,
        entityType: data.entityType,
        entityId: data.entityId,
        description: data.description,
        metadata: data.metadata,
      },
      user,
      data.ipAddress,
      data.userAgent,
    )) as ActivityLog;
  }

  /**
   * Delete activity by ID
   */
  async delete(id: string): Promise<void> {
    await deleteActivity(id);
  }
}
