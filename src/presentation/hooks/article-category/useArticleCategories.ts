import { useState, useEffect } from "react";
import type { ArticleCategory } from "@/domain/value-objects/article-category";

export const useArticleCategories = () => {
  const [categories, setCategories] = useState<ArticleCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/article/category?withCount=true");
        if (!response.ok) {
          throw new Error("Failed to fetch categories");
        }
        const responseData = await response.json();
        // Extract categories from the response (API returns { success, data: [...] })
        const categoriesData = responseData?.data;
        setCategories(Array.isArray(categoriesData) ? categoriesData : []);
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
