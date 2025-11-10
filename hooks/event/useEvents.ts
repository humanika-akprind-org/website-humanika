import { useState, useEffect } from "react";
import { getEvents } from "@/use-cases/api/event";
import type { Event, EventFilter } from "@/types/event";

export function useEvents(filter?: EventFilter) {
  const [events, setEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getEvents(filter);
        setEvents(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch events");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvents();
  }, [filter]);

  return {
    events,
    isLoading,
    error,
    refetch: () => {
      const fetchEvents = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const data = await getEvents(filter);
          setEvents(data);
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch events"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchEvents();
    },
  };
}
