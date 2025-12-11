import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticleCategory } from "@/use-cases/api/article-category";
import type {
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput,
} from "@/types/article-category";

export function useCreateArticleCategory() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createArticleCategoryHandler = async (
    formData: CreateArticleCategoryInput | UpdateArticleCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createArticleCategory(formData as CreateArticleCategoryInput);
      router.push("/admin/content/articles/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create article category. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createArticleCategory: createArticleCategoryHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for article categories
  };
}
