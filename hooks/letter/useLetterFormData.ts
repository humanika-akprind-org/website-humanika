import { useState, useEffect } from "react";

export function useLetterFormData() {
  const [periods, setPeriods] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [periodsRes, eventsRes] = await Promise.allSettled([
          fetch("/api/period"),
          fetch("/api/event"),
        ]);

        const periodsData =
          periodsRes.status === "fulfilled"
            ? await periodsRes.value.json()
            : null;
        const eventsData =
          eventsRes.status === "fulfilled"
            ? await eventsRes.value.json()
            : null;

        setPeriods(periodsData?.data || []);
        setEvents(eventsData?.data || []);
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
