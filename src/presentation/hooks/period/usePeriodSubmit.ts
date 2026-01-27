import { useState } from "react";
import { useRouter } from "next/navigation";
import { createPeriod, updatePeriod } from "@/src/presentation/services/period";
import type { Period, PeriodFormData } from "@/src/domain/entities/period";
import type { AlertType } from "@/src/presentation/components/admin/ui/alert/Alert";

export function usePeriodSubmit(isEdit: boolean, period?: Period) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  const handleSubmit = async (formData: PeriodFormData) => {
    setIsSubmitting(true);
    setAlert(null);

    try {
      if (isEdit && period) {
        await updatePeriod(period.id, formData);
      } else {
        await createPeriod(formData);
      }
      setAlert({ type: "success", message: "Period saved successfully!" });
      router.push("/admin/governance/periods");
      router.refresh();
    } catch (err) {
      console.error("Submission error:", err);
      setAlert({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to save period. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    alert,
    handleSubmit,
  };
}
