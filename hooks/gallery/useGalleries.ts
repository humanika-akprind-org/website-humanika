import { useState, useEffect, useCallback } from "react";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Gallery, GalleryFilter } from "@/types/gallery";

export function useGalleries(filter?: GalleryFilter) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGalleries = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getGalleries(filter);
      setGalleries(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch galleries"
      );
    } finally {
      setIsLoading(false);
    }
  }, [filter]);

  useEffect(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  const refetch = useCallback(() => {
    fetchGalleries();
  }, [fetchGalleries]);

  return {
    galleries,
    isLoading,
    error,
    refetch,
  };
}
