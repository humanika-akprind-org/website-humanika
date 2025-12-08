import { useState } from "react";
import { useRouter } from "next/navigation";
import { createEvent } from "@/use-cases/api/event";
import type { CreateEventInput, UpdateEventInput } from "@/types/event";

export function useCreateEvent() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createEventHandler = async (
    formData: CreateEventInput | UpdateEventInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createEvent(formData as CreateEventInput);
      router.push("/admin/program/events");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create event. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createEvent: createEventHandler,
    isSubmitting,
    error,
    setError,
    handleBack,
    isLoading: false, // No additional loading for events
  };
}
