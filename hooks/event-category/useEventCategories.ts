import { useState, useEffect } from "react";
import { getEventCategories } from "@/use-cases/api/event-category";
import type { EventCategory } from "@/types/event-category";

export function useEventCategories() {
  const [categories, setCategories] = useState<EventCategory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEventCategories();
        setCategories(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to fetch event categories"
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
          const data = await getEventCategories();
          setCategories(data);
        } catch (err) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to fetch event categories"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchCategories();
    },
  };
}
