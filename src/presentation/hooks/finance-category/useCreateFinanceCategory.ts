import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";

export function useCreateFinanceCategory() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createFinanceCategory = async (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/finance/category", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to create finance category");
      router.push("/admin/finance/transactions/categories");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/finance/transactions/categories");
  };

  return {
    createFinanceCategory,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
