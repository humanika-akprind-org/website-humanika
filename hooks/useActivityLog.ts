import { useCallback } from "react";
import { type ActivityType } from "@/types/enums";

import { type ActivityMetadata } from "@/types/activity-log";

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
        const response = await fetch("/api/system/activity", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            activityType,
            entityType,
            entityId,
            description,
            metadata,
          }),
        });

        if (!response.ok) {
          throw new Error("Failed to log activity");
        }

        return await response.json();
      } catch (error) {
        console.error("Error logging activity:", error);
        throw error;
      }
    },
    []
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
        const params = new URLSearchParams();
        if (activityType) params.append("activityType", activityType);
        if (startDate) params.append("startDate", startDate);
        if (endDate) params.append("endDate", endDate);
        params.append("page", String(page));
        params.append("limit", String(limit));

        const response = await fetch(`/api/system/activity?${params}`);
        if (!response.ok) {
          throw new Error("Failed to fetch activity logs");
        }

        return await response.json();
      } catch (error) {
        console.error("Error fetching activity logs:", error);
        throw error;
      }
    },
    []
  );

  return {
    logActivity,
    getActivityLogs,
  };
}
