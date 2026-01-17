import { useState, useEffect } from "react";
import { getPeriods } from "@/use-cases/api/period";
import type { Period } from "@/types/period";

export function useDocumentFormData() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [letters, setLetters] = useState([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, lettersRes, periodsRes] =
          await Promise.allSettled([
            fetch("/api/user?limit=50"),
            fetch("/api/event"),
            fetch("/api/letter"),
            getPeriods(),
          ]);

        const usersData =
          usersRes.status === "fulfilled"
            ? await usersRes.value.json()
            : { users: [] };
        const eventsData =
          eventsRes.status === "fulfilled" ? await eventsRes.value.json() : [];
        const lettersData =
          lettersRes.status === "fulfilled"
            ? await lettersRes.value.json()
            : [];
        const periodsData =
          periodsRes.status === "fulfilled" ? periodsRes.value : [];

        setUsers(usersData.users || []);
        setEvents(eventsData || []);
        setLetters(lettersData || []);
        setPeriods(periodsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, events, letters, periods, loading, error };
}
