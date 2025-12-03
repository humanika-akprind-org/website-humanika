import { useCallback } from "react";
import type { PeriodFormData } from "@/types/period";

interface UsePeriodFormSubmitProps {
  validateForm: () => boolean;
  handleSubmit: (formData: PeriodFormData) => Promise<void>;
  formData: PeriodFormData;
}

export function usePeriodFormSubmit({
  validateForm,
  handleSubmit,
  formData,
}: UsePeriodFormSubmitProps) {
  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      await handleSubmit(formData);
    },
    [validateForm, handleSubmit, formData]
  );

  return { onSubmit };
}
