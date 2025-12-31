import { useState, useEffect } from "react";
import { getEvent } from "@/use-cases/api/event";
import type { Event } from "@/types/event";

export function useEventDetail(id: string) {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadEvent() {
      try {
        setLoading(true);
        const eventData = await getEvent(id);
        setEvent(eventData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load event data"
        );
      } finally {
        setLoading(false);
      }
    }
    loadEvent();
  }, [id]);

  return { event, loading, error };
}
