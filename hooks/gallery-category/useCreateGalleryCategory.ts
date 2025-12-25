import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGalleryCategory } from "@/use-cases/api/gallery-category";
import type {
  CreateGalleryCategoryInput,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";

export function useCreateGalleryCategory() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createGalleryCategoryHandler = async (
    formData: CreateGalleryCategoryInput | UpdateGalleryCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createGalleryCategory(formData as CreateGalleryCategoryInput);
      router.push("/admin/content/galleries/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create gallery category. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createGalleryCategory: createGalleryCategoryHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for gallery categories
  };
}
