import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/domain/value-objects/finance-category";
import {
  createFinanceCategory,
  updateFinanceCategory,
} from "@/presentation/services/finance-category";
import { FinanceType } from "@/domain/enums";

export function useCreateFinanceCategory(
  redirectPath: string = "/admin/finance/categories",
) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createFinanceCategoryFn = async (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateFinanceCategoryInput = {
        name: data.name || "",
        type: data.type || FinanceType.EXPENSE,
        description: data.description,
      };
      await createFinanceCategory(input);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateCategory = async (
    id: string,
    data: UpdateFinanceCategoryInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      await updateFinanceCategory(id, data);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(redirectPath);
  };

  return {
    createFinanceCategory: createFinanceCategoryFn,
    updateCategory,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
