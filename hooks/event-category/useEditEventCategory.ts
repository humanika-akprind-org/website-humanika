import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  getEventCategory,
  updateEventCategory,
} from "@/use-cases/api/event-category";
import type {
  EventCategory,
  UpdateEventCategoryInput,
} from "@/types/event-category";

export function useEditEventCategory(categoryId: string) {
  const router = useRouter();
  const [category, setCategory] = useState<EventCategory | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const categoryData = await getEventCategory(categoryId);
        setCategory(categoryData);
      } catch (err) {
        console.error("Error fetching event category:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load event category"
        );
      } finally {
        setLoading(false);
      }
    };

    if (categoryId) {
      fetchCategory();
    }
  }, [categoryId]);

  const updateEventCategoryHandler = async (
    formData: UpdateEventCategoryInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateEventCategory(categoryId, formData);
      router.push("/admin/program/events/categories");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update event category. Please try again."
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
    updateEventCategory: updateEventCategoryHandler,
    handleBack,
  };
}
