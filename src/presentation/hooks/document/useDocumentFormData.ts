import { useState, useEffect } from "react";
import { UserApi } from "@/presentation/services/user";
import { EventApi } from "@/presentation/services/event";
import { LetterApi } from "@/presentation/services/letter";
import { getPeriods } from "@/presentation/services/period";
import type { User } from "@/domain/entities/user.entity";
import type { Event } from "@/domain/entities/event.entity";
import type { Letter } from "@/domain/entities/letter.entity";
import type { Period } from "@/domain/entities/period.entity";

export function useDocumentFormData() {
  const [users, setUsers] = useState<User[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [letters, setLetters] = useState<Letter[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFormData = async () => {
      try {
        setLoading(true);
        const [usersResponse, eventsData, lettersData, periodsData] =
          await Promise.all([
            UserApi.getUsers(),
            EventApi.getEvents(),
            LetterApi.getLetters(),
            getPeriods(),
          ]);
        // Unwrap ApiResponse for users
        setUsers(usersResponse.data?.users || []);
        setEvents(eventsData);
        setLetters(lettersData);
        setPeriods(periodsData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchFormData();
  }, []);

  return { users, events, letters, periods, loading, error };
}
