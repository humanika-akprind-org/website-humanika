import { useState, useCallback } from "react";
import type { Article } from "@/types/article";

export const useArticleData = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/article?status=PUBLISH");

      if (!response.ok) {
        throw new Error("Failed to fetch articles");
      }

      const data = await response.json();

      if (Array.isArray(data)) {
        setArticles(data);
      } else {
        console.warn("Unexpected data format from articles API:", data);
        setArticles([]);
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "An error occurred";
      setError(errorMessage);
      setArticles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    articles,
    loading,
    error,
    fetchArticles,
  };
};
