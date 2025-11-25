import { useState, useEffect } from "react";
import { getGalleryCategories } from "@/use-cases/api/gallery-category";
import type { GalleryCategory } from "@/types/gallery-category";

export function useGalleryCategories() {
  const [categories, setCategories] = useState<GalleryCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getGalleryCategories();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch gallery categories"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return {
    categories,
    isLoading,
    error,
    refetch: () => {
      const fetchCategories = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getGalleryCategories();
          setCategories(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch gallery categories"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategories();
    },
  };
}
