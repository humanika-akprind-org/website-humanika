import { useState, useEffect } from "react";
import { UserApi } from "@/presentation/services/user";
import { PeriodApi } from "@/presentation/services/period";
import type { User } from "@/domain/entities/user.entity";
import type { Period } from "@/domain/entities/period.entity";

export function useEventFormData() {
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, periodsResponse] = await Promise.all([
          UserApi.getUsers({ allUsers: true }),
          PeriodApi.getPeriods(),
        ]);

        setUsers(usersResponse.data?.users || []);
        setPeriods(periodsResponse);
      } catch (err) {
        console.error("Error loading form data:", err);
        setError(
          err instanceof Error ? err.message : "Failed to load form data",
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
    loading,
    error,
  };
}
