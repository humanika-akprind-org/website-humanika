import { useState } from "react";
import { useRouter } from "next/navigation";
import { createWorkProgram } from "@/use-cases/api/work";
import type {
  CreateWorkProgramInput,
  UpdateWorkProgramInput,
} from "@/types/work";
import { Status } from "@/types/enums";

export function useCreateWorkProgram() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createWorkProgramSubmit = async (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createWorkProgram(data as CreateWorkProgramInput);
      router.push("/admin/program/works");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create work program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createWorkProgramForApproval = async (
    data: CreateWorkProgramInput | UpdateWorkProgramInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createWorkProgram({
        ...data,
        status: Status.PENDING,
      } as CreateWorkProgramInput);
      router.push("/admin/program/works");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create work program. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createWorkProgramSubmit,
    createWorkProgramForApproval,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
