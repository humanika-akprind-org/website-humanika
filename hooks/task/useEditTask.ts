import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getDepartmentTask, updateDepartmentTask } from "@/use-cases/api/task";
import { getUsers } from "@/use-cases/api/user";
import { useWorkPrograms } from "@/hooks/work-program/useWorkPrograms";
import type { DepartmentTask, UpdateDepartmentTaskInput } from "@/types/task";
import type { User } from "@/types/user";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditTask(taskId: string) {
  const router = useRouter();
  const [task, setTask] = useState<DepartmentTask | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  // Fetch work programs
  const { workPrograms, isLoading: workProgramsLoading } = useWorkPrograms();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const [taskData, usersResponse] = await Promise.all([
          getDepartmentTask(taskId),
          getUsers(),
        ]);

        setTask(taskData);

        if (usersResponse.data) {
          setUsers(usersResponse.data.users);
        } else if (usersResponse.error) {
          setError(usersResponse.error);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    if (taskId) {
      fetchData();
    }
  }, [taskId]);

  const handleSubmit = async (formData: UpdateDepartmentTaskInput) => {
    try {
      setAlert(null);
      await updateDepartmentTask(taskId, formData);
      setAlert({ type: "success", message: "Task updated successfully" });
      router.push("/admin/governance/tasks");
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        type: "error",
        message: "Failed to update task. Please try again.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    task,
    users,
    workPrograms,
    loading: loading || workProgramsLoading,
    error,
    alert,
    handleSubmit,
    handleBack,
  };
}
