import { useState, useEffect } from "react";
import { ActivityApi } from "@/presentation/services/activity";
import type { ActivityLog } from "@/domain/entities/activity-log.entity";

export function useActivityStats() {
  const [activityStats, setActivityStats] = useState<ActivityLog[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await ActivityApi.getActivities();
        // Extract activities from the response object
        setActivityStats(response.activities || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivities();
  }, []);

  return { activityStats, isLoading, error };
}
