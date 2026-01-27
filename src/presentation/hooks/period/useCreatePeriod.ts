import { useState } from "react";
import { useRouter } from "next/navigation";
import { PeriodApi } from "@/presentation/services/period";
import type { PeriodFormData } from "@/domain/entities/period.entity";

export function useCreatePeriod() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createPeriod = async (formData: PeriodFormData) => {
    setIsSubmitting(true);
    setError("");

    try {
      await PeriodApi.createPeriod(formData);
      router.push("/admin/governance/periods");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create period. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createPeriod,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
