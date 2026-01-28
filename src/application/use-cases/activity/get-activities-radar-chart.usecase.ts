/**
 * Get Activities Use Case - Complex read operation
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This use case handles fetching activities for radar chart visualization
 * with role-based filtering and department aggregation.
 */

import type { RadarChartResult } from "@/application/interface/activity.repository.interface";
import { UserRole, Department } from "@/domain/enums";
import { getActivitiesForRadarChart } from "@/infrastructure/repositories/activity";

/**
 * Input for the get activities radar chart use case
 */
export interface GetActivitiesRadarChartInput {
  allowedRoles?: UserRole[];
  allowedDepartments?: Department[];
}

/**
 * Result of the get activities radar chart use case
 */
export interface GetActivitiesRadarChartResult {
  data: RadarChartResult[];
}

/**
 * Default allowed roles for activity tracking
 */
const DEFAULT_ALLOWED_ROLES: UserRole[] = [
  UserRole.DPO,
  UserRole.BPH,
  UserRole.PENGURUS,
];

/**
 * Default allowed departments for radar chart visualization
 */
const DEFAULT_ALLOWED_DEPARTMENTS: Department[] = [
  Department.BPH,
  Department.INFOKOM,
  Department.LITBANG,
  Department.KWU,
  Department.PSDM,
];

/**
 * Get Activities Radar Chart Use Case
 *
 * This use case fetches activities filtered by specific roles
 * and aggregates them by department for radar chart visualization.
 *
 * Use this when you need:
 * - Complex read operations with business logic
 * - Filtering by user roles
 * - Data aggregation for visualization
 */
export class GetActivitiesRadarChartUseCase {
  /**
   * Execute the use case to get activities for radar chart
   *
   * @param input - Optional input parameters for filtering
   * @returns Radar chart data with department activity counts
   */
  async execute(
    input?: GetActivitiesRadarChartInput,
  ): Promise<GetActivitiesRadarChartResult> {
    // Use provided values or defaults
    const allowedRoles = input?.allowedRoles || DEFAULT_ALLOWED_ROLES;
    const allowedDepartments =
      input?.allowedDepartments || DEFAULT_ALLOWED_DEPARTMENTS;

    // Validate inputs
    if (allowedRoles.length === 0) {
      throw new Error("At least one role must be specified");
    }

    if (allowedDepartments.length === 0) {
      throw new Error("At least one department must be specified");
    }

    // Execute the repository function
    const radarData = await getActivitiesForRadarChart(
      allowedRoles,
      allowedDepartments,
    );

    return {
      data: radarData,
    };
  }

  /**
   * Execute with custom roles and departments
   * Useful for flexible querying based on different criteria
   */
  async executeWithCustomFilters(
    roles: UserRole[],
    departments: Department[],
  ): Promise<GetActivitiesRadarChartResult> {
    // Validate inputs
    if (roles.length === 0) {
      throw new Error("At least one role must be specified");
    }

    if (departments.length === 0) {
      throw new Error("At least one department must be specified");
    }

    const radarData = await getActivitiesForRadarChart(roles, departments);

    return {
      data: radarData,
    };
  }
}
