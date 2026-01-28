import { useState, useCallback } from "react";
import type { Article } from "@/domain/entities/article.entity";
import { ArticleApi } from "@/presentation/services/article";

export const useArticleData = () => {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchArticles = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const data = await ArticleApi.getPublishedArticles();
      setArticles(data);
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
