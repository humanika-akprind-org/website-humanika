import { useState, useEffect, useCallback } from "react";
import { getArticleBySlug } from "use-cases/api/article";
import type { Article } from "types/article";

export function useArticleDetail(slug: string | undefined) {
  const [article, setArticle] = useState<Article | null>(null);
  const [relatedArticles, setRelatedArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const loadArticle = useCallback(async () => {
    if (!slug) return;

    try {
      setLoading(true);
      setError(null);
      const articleData = await getArticleBySlug(slug);
      setArticle(articleData);
      setRelatedArticles(articleData.relatedArticles || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load article data"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadArticle();
  }, [slug, loadArticle]);

  const refetch = () => {
    loadArticle();
  };

  return {
    article,
    relatedArticles,
    loading,
    error,
    refetch,
  };
}
