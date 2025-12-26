import { useState, useEffect } from "react";
import { getGalleries } from "@/use-cases/api/gallery";
import type { Gallery, GalleryFilter } from "@/types/gallery";

export function useGalleries(filter?: GalleryFilter) {
  const [galleries, setGalleries] = useState<Gallery[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGalleries = async () => {
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
    };

    fetchGalleries();
  }, [filter]);

  return {
    galleries,
    isLoading,
    error,
    refetch: () => {
      const fetchGalleries = async () => {
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
      };
      fetchGalleries();
    },
  };
}
