import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getEvent, updateEvent } from "@/use-cases/api/event";
import type { CreateEventInput, UpdateEventInput, Event } from "@/types/event";

export function useEditEvent(eventId: string) {
  const router = useRouter();
  const [event, _setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const fetchedEvent = await getEvent(eventId);
        _setEvent(fetchedEvent);
      } catch (err) {
        console.error("Error fetching event:", err);
        setError(err instanceof Error ? err.message : "Failed to load event");
      } finally {
        setLoading(false);
      }
    };

    if (eventId) {
      fetchEvent();
    }
  }, [eventId]);

  const updateEventHandler = async (
    formData: CreateEventInput | UpdateEventInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateEvent(eventId, formData as UpdateEventInput);
      router.push("/admin/program/events");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update event. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    event,
    loading,
    error,
    isSubmitting,
    updateEvent: updateEventHandler,
    handleBack,
  };
}
