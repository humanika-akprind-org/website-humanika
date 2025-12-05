import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { PeriodApi } from "@/use-cases/api/period";
import type { Period, PeriodFormData } from "@/types/period";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditPeriod(periodId: string) {
  const router = useRouter();
  const [period, setPeriod] = useState<Period | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchPeriod = async () => {
      try {
        setLoading(true);
        setError(null);
        const periodData = await PeriodApi.getPeriod(periodId);
        setPeriod(periodData);
      } catch (_error) {
        setError("Failed to fetch period data");
      } finally {
        setLoading(false);
      }
    };

    fetchPeriod();
  }, [periodId]);

  const handleSubmit = async (formData: PeriodFormData) => {
    try {
      setAlert(null);
      await PeriodApi.updatePeriod(periodId, formData);
      setAlert({ type: "success", message: "Period updated successfully" });
      router.push("/admin/governance/periods");
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        type: "error",
        message: "Failed to update period. Please try again.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    period,
    loading,
    error,
    alert,
    handleSubmit,
    handleBack,
  };
}
