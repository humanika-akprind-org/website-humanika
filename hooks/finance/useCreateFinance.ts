import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateFinanceInput, UpdateFinanceInput } from "@/types/finance";
import { Status } from "@/types/enums";

export function useCreateFinance() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createFinance = async (
    data: CreateFinanceInput | UpdateFinanceInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: Status.DRAFT,
        }),
      });
      if (!response.ok) throw new Error("Failed to create finance transaction");
      router.push("/admin/finance/transactions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createFinanceForApproval = async (
    data: CreateFinanceInput | UpdateFinanceInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/finance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: Status.PENDING,
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create finance transaction for approval");
      }
      router.push("/admin/finance/transactions");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/finance/transactions");
  };

  return {
    createFinance,
    createFinanceForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
