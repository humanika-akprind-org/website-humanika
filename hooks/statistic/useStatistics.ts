import { useState, useEffect, useCallback } from "react";
import {
  getStatistics,
  getActivePeriodStatistic,
} from "@/use-cases/api/statistic";
import type { Statistic, StatisticFilter } from "@/types/statistic";

export function useStatistics(filter?: StatisticFilter) {
  const [statistics, setStatistics] = useState<Statistic[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchStatistics = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getStatistics(filter);
      setStatistics(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch statistics"
      );
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  const refetch = useCallback(() => {
    fetchStatistics();
  }, [fetchStatistics]);

  return {
    statistics,
    isLoading,
    error,
    refetch,
  };
}

export function useActivePeriodStatistic() {
  const [statistic, setStatistic] = useState<Statistic | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchActivePeriodStatistic = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getActivePeriodStatistic();
        setStatistic(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch active period statistic"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchActivePeriodStatistic();
  }, []);

  return { statistic, isLoading, error };
}
