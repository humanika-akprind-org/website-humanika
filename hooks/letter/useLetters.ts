import { useState, useEffect } from "react";
import { getLetters } from "@/use-cases/api/letter";
import type { Letter, LetterFilter } from "@/types/letter";

export function useLetters(filter?: LetterFilter) {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLetters = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getLetters(filter);
        setLetters(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch letters"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchLetters();
  }, [filter]);

  return {
    letters,
    isLoading,
    error,
    refetch: () => {
      const fetchLetters = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getLetters(filter);
          setLetters(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch letters"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchLetters();
    },
  };
}
