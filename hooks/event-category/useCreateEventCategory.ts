import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEventCategory } from "@/use-cases/api/event-category";
import type {
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/types/event-category";

export function useCreateEventCategory() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createEventCategoryHandler = async (
    formData: CreateEventCategoryInput | UpdateEventCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createEventCategory(formData as CreateEventCategoryInput);
      router.push("/admin/program/events/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create event category. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createEventCategory: createEventCategoryHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for event categories
  };
}
