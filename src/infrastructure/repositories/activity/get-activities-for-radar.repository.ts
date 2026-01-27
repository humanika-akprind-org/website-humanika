/**
 * Get Activities For Radar Chart Repository - Read operations
 * Part of Clean Architecture: Infrastructure Layer (Repository)
 *
 * Handles fetching activities for radar chart visualization
 * with role-based filtering and department aggregation.
 */

import prisma from "@/presentation/lib/prisma";
import type { RadarChartResult } from "@/application/interface/activity.repository.interface";
import type { UserRole, Department } from "@/domain/enums";

/**
 * Get activities for radar chart visualization
 * Filters by specific roles and aggregates by department
 */
export const getActivitiesForRadarChart = async (
  allowedRoles: UserRole[],
  allowedDepartments: Department[],
): Promise<RadarChartResult[]> => {
  // Get all activities with user and management info, filtered by roles
  const activities = await prisma.activityLog.findMany({
    where: {
      user: {
        role: {
          in: allowedRoles,
        },
      },
    },
    include: {
      user: {
        include: {
          managements: {
            where: {
              period: {
                isActive: true,
              },
            },
            select: {
              department: true,
            },
          },
        },
      },
    },
  });

  // Group activities by department and count them
  const departmentActivityCounts: { [key: string]: number } = {};

  activities.forEach((activity) => {
    if (activity.user?.managements && activity.user.managements.length > 0) {
      const department = activity.user.managements[0].department;
      if (allowedDepartments.includes(department as Department)) {
        departmentActivityCounts[department] =
          (departmentActivityCounts[department] || 0) + 1;
      }
    }
  });

  // Calculate fullMark as the maximum count across all departments
  const counts = Object.values(departmentActivityCounts);
  const fullMark = counts.length > 0 ? Math.max(...counts) : 100;

  // Create data for radar chart using allowed departments
  const radarData: RadarChartResult[] = allowedDepartments.map((dept) => ({
    subject: dept,
    A: departmentActivityCounts[dept] || 0,
    fullMark,
  }));

  return radarData;
};
