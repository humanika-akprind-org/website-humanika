import { useState, useEffect } from "react";
import { StructureApi } from "@/use-cases/api/structure";
import type { OrganizationalStructure } from "@/types/structure";

export function useStructures() {
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStructures = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await StructureApi.getStructures();
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setStructures(response.data);
        }
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch structures"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchStructures();
  }, []);

  return {
    structures,
    isLoading,
    error,
    refetch: () => {
      const fetchStructures = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await StructureApi.getStructures();
          if (response.error) {
            setError(response.error);
          } else if (response.data) {
            setStructures(response.data);
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch structures"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchStructures();
    },
  };
}
