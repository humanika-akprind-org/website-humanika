import { useState } from "react";
import { useRouter } from "next/navigation";
import { createArticle } from "@/use-cases/api/article";
import type { CreateArticleInput, UpdateArticleInput } from "@/types/article";

export function useCreateArticle() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createArticleHandler = async (
    formData: CreateArticleInput | UpdateArticleInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createArticle(formData as CreateArticleInput);
      router.push("/admin/content/articles");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create article. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createArticle: createArticleHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for articles
  };
}
