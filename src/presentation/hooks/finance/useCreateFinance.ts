import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/domain/entities/finance.entity";
import { FinanceApi } from "@/presentation/services/finance";
import { FinanceType } from "@/domain/enums";

export function useCreateFinance(
  redirectPath: string = "/admin/finance/transactions",
) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createFinance = async (
    data: CreateFinanceInput | UpdateFinanceInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateFinanceInput = {
        name: data.name ?? "",
        amount: data.amount ?? 0,
        description: data.description ?? "",
        date: data.date ?? new Date(),
        categoryId: data.categoryId ?? null,
        type: data.type ?? FinanceType.EXPENSE,
        proof: data.proof ?? undefined,
        workProgramId: data.workProgramId ?? undefined,
        periodId: data.periodId ?? undefined,
      };
      await FinanceApi.createFinance(input);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createFinanceForApproval = async (
    data: CreateFinanceInput | UpdateFinanceInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateFinanceInput = {
        name: data.name ?? "",
        amount: data.amount ?? 0,
        description: data.description ?? "",
        date: data.date ?? new Date(),
        categoryId: data.categoryId ?? null,
        type: data.type ?? FinanceType.EXPENSE,
        proof: data.proof ?? undefined,
        workProgramId: data.workProgramId ?? undefined,
        periodId: data.periodId ?? undefined,
      };
      await FinanceApi.createFinance(input);
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
    createFinance,
    createFinanceForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
