import { useState, useEffect } from "react";
import type { ArticleCategory } from "@/domain/value-objects/article-category";
import { ArticleCategoryApi } from "@/presentation/services/article-category";

export const useArticleCategories = () => {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const data = await ArticleCategoryApi.getArticleCategoriesWithCount();
        setCategories(Array.isArray(data) ? data : []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  return { categories, loading, error };
};
