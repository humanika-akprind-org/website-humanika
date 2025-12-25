import { useState } from "react";
import { useRouter } from "next/navigation";
import { createGallery } from "@/use-cases/api/gallery";
import type { CreateGalleryInput, UpdateGalleryInput } from "@/types/gallery";

export function useCreateGallery() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createGalleryHandler = async (
    formData: CreateGalleryInput | UpdateGalleryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createGallery(formData as CreateGalleryInput);
      router.push("/admin/content/galleries");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create gallery. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createGallery: createGalleryHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for galleries
  };
}
