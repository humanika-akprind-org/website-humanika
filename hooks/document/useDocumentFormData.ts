import { useState, useEffect } from "react";

export function useDocumentFormData() {
  const [users, setUsers] = useState([]);
  const [events, setEvents] = useState([]);
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, eventsRes, lettersRes] = await Promise.allSettled([
          fetch("/api/user?limit=50"),
          fetch("/api/event"),
          fetch("/api/letter"),
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

        setUsers(usersData.users || []);
        setEvents(eventsData || []);
        setLetters(lettersData || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return { users, events, letters, loading, error };
}
