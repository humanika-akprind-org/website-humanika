import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getFinance, updateFinance } from "@/use-cases/api/finance";
import type {
  CreateFinanceInput,
  UpdateFinanceInput,
  Finance,
} from "@/types/finance";

export function useEditFinance(financeId: string) {
  const router = useRouter();
  const [finance, setFinance] = useState<Finance | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchFinance = async () => {
      try {
        const fetchedFinance = await getFinance(financeId);
        setFinance(fetchedFinance);
      } catch (err) {
        console.error("Error fetching finance:", err);
        setError(err instanceof Error ? err.message : "Failed to load finance");
      } finally {
        setLoading(false);
      }
    };

    if (financeId) {
      fetchFinance();
    }
  }, [financeId]);

  const updateFinanceHandler = async (
    formData: CreateFinanceInput | UpdateFinanceInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await updateFinance(financeId, formData as UpdateFinanceInput);
      router.push("/admin/finance/transactions");
    } catch (err) {
      console.error("Submission error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update finance. Please try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    finance,
    loading,
    error,
    isSubmitting,
    updateFinance: updateFinanceHandler,
    handleBack,
  };
}
