import { useState, useEffect } from "react";
import { getPeriods } from "@/presentation/services/period";
import { EventApi } from "@/presentation/services/event";
import type { Period } from "@/domain/entities/period.entity";
import type { Event } from "@/domain/entities/event.entity";

export function useLetterFormData() {
  const [periods, setPeriods] = useState<Period[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [periodsRes, eventsRes] = await Promise.all([
          getPeriods(),
          EventApi.getEvents(),
        ]);

        setPeriods(periodsRes || []);
        setEvents(eventsRes || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { periods, events, loading, error };
}
