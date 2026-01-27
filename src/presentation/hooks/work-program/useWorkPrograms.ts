import { useState, useEffect } from "react";
import { getWorkPrograms } from "@/presentation/services/work";
import type {
  WorkProgram,
  WorkProgramFilter,
} from "@/domain/entities/work-program.entity";

export function useWorkPrograms(filter?: WorkProgramFilter) {
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWorkPrograms = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getWorkPrograms(filter);
        setWorkPrograms(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch work programs",
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchWorkPrograms();
  }, [filter]);

  return {
    workPrograms,
    isLoading,
    error,
    refetch: () => {
      const fetchWorkPrograms = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getWorkPrograms(filter);
          setWorkPrograms(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch work programs",
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchWorkPrograms();
    },
  };
}
