import { useState, useEffect } from "react";
import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";

export function useArticleFormData(): {
  users: User[];
  periods: Period[];
  currentUser: User | null;
  loading: boolean;
  error: string;
} {
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, periodsResponse, currentUserResponse] =
          await Promise.all([
            UserApi.getUsers({ limit: 50 }),
            PeriodApi.getPeriods(),
            fetch("/api/auth/me").then((res) => (res.ok ? res.json() : null)),
          ]);

        setUsers(usersResponse.data?.users || []);
        setPeriods(periodsResponse || []);
        setCurrentUser(currentUserResponse);
      } catch (err) {
        console.error("Error loading form data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load form data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return {
    users,
    periods,
    currentUser,
    loading,
    error,
  };
}
