import { useState, useEffect, useCallback } from "react";
import { getEventBySlug, getEvents } from "use-cases/api/event";
import type { Event } from "types/event";
import { getPastEvents, getRelatedEvents } from "lib/eventDetailUtils";

interface UseEventDetailPageReturn {
  event: Event | null;
  allEvents: Event[];
  relatedEvents: Event[];
  pastEvents: Event[];
  loading: boolean;
  error: string | null;
  isBookmarked: boolean;
  setIsBookmarked: (value: boolean) => void;
  refetch: () => void;
}

/**
 * Custom hook for managing event detail page state and data fetching
 * @param slug - Event slug from URL params
 * @returns Object containing all state and data for the event detail page
 */
export function useEventDetailPage(slug: string): UseEventDetailPageReturn {
  const [event, setEvent] = useState<Event | null>(null);
  const [allEvents, setAllEvents] = useState<Event[]>([]);
  const [relatedEvents, setRelatedEvents] = useState<Event[]>([]);
  const [pastEvents, setPastEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch event data by slug
  const loadEvent = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const eventData = await getEventBySlug(slug);
      setEvent(eventData);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load event data"
      );
    } finally {
      setLoading(false);
    }
  }, [slug]);

  useEffect(() => {
    loadEvent();
  }, [slug, loadEvent]);

  // Fetch all events and compute related/past events
  useEffect(() => {
    async function loadAllEvents() {
      try {
        const events = await getEvents();
        setAllEvents(events);

        // Filter related and past events if current event is loaded
        if (event) {
          const related = getRelatedEvents(events, event);
          const past = getPastEvents(events, event.id);

          setRelatedEvents(related);
          setPastEvents(past);
        }
      } catch (err) {
        console.error("Failed to load all events:", err);
      }
    }
    loadAllEvents();
  }, [event]);

  return {
    event,
    allEvents,
    relatedEvents,
    pastEvents,
    loading,
    error,
    isBookmarked,
    setIsBookmarked,
    refetch: loadEvent,
  };
}
