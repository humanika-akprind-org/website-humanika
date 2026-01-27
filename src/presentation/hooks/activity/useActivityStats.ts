import { useState, useEffect } from "react";

interface ActivityStatsData {
  subject: string;
  A: number;
  fullMark: number;
}

export const useActivityStats = () => {
  const [activityStats, setActivityStats] = useState<ActivityStatsData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchActivityStats = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await fetch("/api/activity");
      if (!response.ok) {
        throw new Error("Failed to fetch activity stats");
      }
      const data = await response.json();
      setActivityStats(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch activity stats"
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchActivityStats();
  }, []);

  return {
    activityStats,
    isLoading,
    error,
    refetch: fetchActivityStats,
  };
};
