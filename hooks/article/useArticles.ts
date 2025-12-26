import { useState, useEffect } from "react";
import { getArticles } from "@/use-cases/api/article";
import type { Article, ArticleFilter } from "@/types/article";

export function useArticles(filter?: ArticleFilter) {
  const [articles, setArticles] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getArticles(filter);
        setArticles(data);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to fetch articles"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchArticles();
  }, [filter]);

  return {
    articles,
    isLoading,
    error,
    refetch: () => {
      const fetchArticles = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getArticles(filter);
          setArticles(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch articles"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchArticles();
    },
  };
}
