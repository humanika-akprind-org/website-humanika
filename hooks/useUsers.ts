import { useState, useEffect } from "react";
import { getUsers } from "@/lib/api/user";
import type { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setLoading(true);
        const response = await getUsers({
          isActive: true,
          limit: 50, // Get all active users
        });

        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setUsers(response.data.users);
        }
      } catch (_err) {
        setError("Failed to fetch users");
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return { users, loading, error };
}
