import { useState, useEffect } from "react";
import { getArticle } from "use-cases/api/article";
import type { Article } from "types/article";

export function useArticleDetail(id: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadArticle() {
      if (!id) return;

      try {
        setLoading(true);
        const articleData = await getArticle(id);
        setArticle(articleData);
        setRelatedArticles(articleData.relatedArticles || []);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load article data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadArticle();
  }, [id]);

  return {
    article,
    relatedArticles,
    loading,
    error,
  };
}
