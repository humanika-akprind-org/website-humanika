import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getArticle, updateArticle } from "@/use-cases/api/article";
import type {
  CreateArticleInput,
  UpdateArticleInput,
  Article,
} from "@/types/article";

export function useEditArticle(articleId: string) {
  const router = useRouter();
  const [article, _setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        const fetchedArticle = await getArticle(articleId);
        _setArticle(fetchedArticle);
      } catch (err) {
        console.error("Error fetching article:", err);
        setError(err instanceof Error ? err.message : "Failed to load article");
      } finally {
        setLoading(false);
      }
    };

    if (articleId) {
      fetchArticle();
    }
  }, [articleId]);

  const updateArticleHandler = async (
    formData: CreateArticleInput | UpdateArticleInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateArticle(articleId, formData as UpdateArticleInput);
      router.push("/admin/content/articles");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update article. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    article,
    loading,
    error,
    isSubmitting,
    updateArticle: updateArticleHandler,
    handleBack,
  };
}
