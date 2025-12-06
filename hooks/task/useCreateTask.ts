import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDepartmentTask } from "@/use-cases/api/task";
import type {
  CreateDepartmentTaskInput,
  UpdateDepartmentTaskInput,
} from "@/types/task";

export function useCreateTask() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

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
  };
}
