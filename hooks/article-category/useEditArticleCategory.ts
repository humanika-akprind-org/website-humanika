import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getArticleCategory,
  updateArticleCategory,
} from "@/use-cases/api/article-category";
import type {
  ArticleCategory,
  UpdateArticleCategoryInput,
} from "@/types/article-category";

export function useEditArticleCategory(categoryId: string) {
  const router = useRouter();
  const [category, setCategory] = useState<ArticleCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getArticleCategory(categoryId);
        setCategory(categoryData);
      } catch (err) {
        console.error("Error fetching article category:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load article category"
        );
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const updateArticleCategoryHandler = async (
    formData: UpdateArticleCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateArticleCategory(categoryId, formData);
      router.push("/admin/content/articles/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update article category. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    category,
    loading,
    error,
    isSubmitting,
    updateArticleCategory: updateArticleCategoryHandler,
    handleBack,
  };
}
