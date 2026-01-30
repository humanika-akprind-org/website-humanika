import { useState, useEffect } from "react";
import {
  ActivityApi,
  type RadarChartResult,
} from "@/presentation/services/activity";

export function useActivityStats() {
  const [activityStats, setActivityStats] = useState<RadarChartResult[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivities = async () => {
      try {
        const response = await ActivityApi.getActivitiesRadarChart();
        // Use the pre-aggregated radar chart data
        setActivityStats(response || []);
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
