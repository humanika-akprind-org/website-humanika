import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getWorkProgram, updateWorkProgram } from "@/use-cases/api/work";
import type {
  WorkProgram,
  UpdateWorkProgramInput,
  CreateWorkProgramInput,
} from "@/types/work";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditWorkProgram(workProgramId: string) {
  const router = useRouter();
  const [workProgram, setWorkProgram] = useState<WorkProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchWorkProgram = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getWorkProgram(workProgramId);
        setWorkProgram(data);
      } catch (err) {
        console.error("Error fetching work program:", err);
        setError("Failed to load work program data");
      } finally {
        setLoading(false);
      }
    };

    if (workProgramId) {
      fetchWorkProgram();
    }
  }, [workProgramId]);

  const handleSubmit = async (
    data: CreateWorkProgramInput | UpdateWorkProgramInput,
  ) => {
    try {
      setAlert(null);
      await updateWorkProgram(workProgramId, data as UpdateWorkProgramInput);
      setAlert({
        type: "success",
        message: "Work program updated successfully",
      });
      router.push("/admin/program/works");
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        type: "error",
        message: "Failed to update work program. Please try again.",
      });
    }
  };

  const handleSubmitForApproval = async (
    data: CreateWorkProgramInput | UpdateWorkProgramInput,
  ) => {
    try {
      setAlert(null);
      await updateWorkProgram(workProgramId, {
        ...data,
        status: "PENDING",
      } as UpdateWorkProgramInput);
      setAlert({
        type: "success",
        message: "Work program submitted for approval successfully",
      });
      router.push("/admin/program/works");
    } catch (_error) {
      setAlert({
        type: "error",
        message:
          "Failed to submit work program for approval. Please try again.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    workProgram,
    loading,
    error,
    alert,
    handleSubmit,
    handleSubmitForApproval,
    handleBack,
  };
}
