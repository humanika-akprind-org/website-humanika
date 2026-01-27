import { useState } from "react";
import { useRouter } from "next/navigation";
import { ManagementApi } from "@/presentation/services/management";
import type { ManagementServerData } from "@/domain/entities/management";

export function useCreateManagement() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createManagement = async (formData: ManagementServerData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await ManagementApi.createManagement(formData);
      router.push("/admin/governance/managements");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create management. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createManagement,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
