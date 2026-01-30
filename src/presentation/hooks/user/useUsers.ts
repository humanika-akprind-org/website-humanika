import { useState, useEffect } from "react";
import { UserApi } from "@/presentation/services/user";
import type { User } from "@/domain/entities/user.entity";

export function useUsers() {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const response = await UserApi.getUsers({ allUsers: true });
      setUsers(
        (response.data?.users || []).filter(
          (user: User) => user.verifiedAccount,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch users");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    isLoading,
    error,
    refetch: fetchUsers,
  };
}
