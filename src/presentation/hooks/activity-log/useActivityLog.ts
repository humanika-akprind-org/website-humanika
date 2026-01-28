import { useCallback } from "react";
import { type ActivityType } from "@/domain/enums";
import { type ActivityMetadata } from "@/domain/entities/activity-log.entity";
import { ActivityApi } from "@/presentation/services/activity";

interface LogActivityParams {
  activityType: ActivityType;
  entityType: string;
  entityId?: string;
  description: string;
  metadata?: ActivityMetadata;
}

export function useActivityLog() {
  const logActivity = useCallback(
    async ({
      activityType,
      entityType,
      entityId,
      description,
      metadata,
    }: LogActivityParams) => {
      try {
        await ActivityApi.logActivity({
          activityType,
          entityType,
          entityId,
          description,
          metadata,
        });
      } catch (error) {
        console.error("Error logging activity:", error);
        throw error;
      }
    },
    [],
  );

  const getActivityLogs = useCallback(
    async ({
      activityType,
      startDate,
      endDate,
      page = 1,
      limit = 10,
    }: {
      activityType?: ActivityType;
      startDate?: string;
      endDate?: string;
      page?: number;
      limit?: number;
    } = {}) => {
      try {
        return await ActivityApi.getActivities({
          activityType,
          startDate,
          endDate,
          page,
          limit,
        });
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
      }
    },
    [],
  );

  return {
    logActivity,
    getActivityLogs,
  };
}
