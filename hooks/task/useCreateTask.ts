import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createDepartmentTask } from "@/use-cases/api/task";
import { useWorkPrograms } from "@/hooks/work-program/useWorkPrograms";
import { UserApi } from "@/use-cases/api/user";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";
import type { User } from "@/types/user";

export function useCreateTask() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [users, setUsers] = useState<User[]>([]);

  // Fetch work programs
  const { workPrograms, isLoading } = useWorkPrograms();

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await UserApi.getUsers({ allUsers: true });
        if (response.data) {
          setUsers(response.data.users);
        }
      } catch (err) {
        console.error("Failed to fetch users:", err);
      }
    };

    fetchUsers();
  }, []);

  const createTask = async (
    formData: CreateDepartmentTaskInput | UpdateDepartmentTaskInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createDepartmentTask(formData as CreateDepartmentTaskInput);
      router.push("/admin/governance/tasks");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create task. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createTask,
    isSubmitting,
    error,
    setError,
    handleBack,
    workPrograms,
    users,
    isLoading,
  };
}
