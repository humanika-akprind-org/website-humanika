import { useState, useEffect } from "react";
import { UserApi } from "@/use-cases/api/user";
import type { User } from "@/types/user";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await UserApi.getUsers({ allUsers: true });
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setUsers(response.data.users.filter((user) => user.verifiedAccount));
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to fetch users");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: () => {
      const fetchUsers = async () => {
        try {
          setIsLoading(true);
          setError(null);
          const response = await UserApi.getUsers({ allUsers: true });
          if (response.error) {
            setError(response.error);
          } else if (response.data) {
            setUsers(
              response.data.users.filter((user) => user.verifiedAccount)
            );
          }
        } catch (err) {
          setError(
            err instanceof Error ? err.message : "Failed to fetch users"
          );
        } finally {
          setIsLoading(false);
        }
      };
      fetchUsers();
    },
  };
}
