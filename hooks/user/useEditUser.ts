import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { UserApi } from "@/use-cases/api/user";
import type { User } from "@/types/user";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditUser(userId: string) {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setAlert(null);
        const response = await UserApi.getUserById(userId);

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else if (response.data) {
          setUser(response.data);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to fetch user data" });
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [userId]);

  const handleSuccess = () => {
    router.push("/admin/people/users");
  };

  const handleDelete = () => {
    router.push("/admin/people/users");
  };

  const handleBack = () => {
    router.back();
  };

  return {
    user,
    loading,
    alert,
    handleSuccess,
    handleDelete,
    handleBack,
  };
}
