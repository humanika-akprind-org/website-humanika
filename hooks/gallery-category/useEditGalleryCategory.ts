import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getGalleryCategory,
  updateGalleryCategory,
} from "@/use-cases/api/gallery-category";
import type {
  GalleryCategory,
  UpdateGalleryCategoryInput,
} from "@/types/gallery-category";

export function useEditGalleryCategory(categoryId: string) {
  const router = useRouter();
  const [category, setCategory] = useState<GalleryCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getGalleryCategory(categoryId);
        setCategory(categoryData);
      } catch (err) {
        console.error("Error fetching gallery category:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load gallery category"
        );
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const updateGalleryCategoryHandler = async (
    formData: UpdateGalleryCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateGalleryCategory(categoryId, formData);
      router.push("/admin/content/galleries/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update gallery category. Please try again."
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
    updateGalleryCategory: updateGalleryCategoryHandler,
    handleBack,
  };
}
