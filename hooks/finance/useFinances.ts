import { useState, useEffect } from "react";
import { getFinances } from "@/use-cases/api/finance";
import type { Finance, FinanceFilter } from "@/types/finance";

export function useFinances(filter?: FinanceFilter) {
  const [finances, setFinances] = useState<Finance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFinances = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getFinances(filter);
        setFinances(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch finances"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchFinances();
  }, [filter]);

  return {
    finances,
    isLoading,
    error,
    refetch: () => {
      const fetchFinances = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getFinances(filter);
          setFinances(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch finances"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchFinances();
    },
  };
}
