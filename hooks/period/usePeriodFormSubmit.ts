import { useCallback } from "react";
import type { PeriodFormData } from "@/types/period";

interface UsePeriodFormSubmitProps {
  validateForm: () => boolean;
  handleSubmit: (formData: PeriodFormData) => Promise<void>;
  formData: PeriodFormData;
  onSubmit?: (data: PeriodFormData) => Promise<void>;
}

export function usePeriodFormSubmit({
  validateForm,
  handleSubmit,
  formData,
  onSubmit: externalOnSubmit,
}: UsePeriodFormSubmitProps) {
  const onSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();

      if (!validateForm()) return;

      if (externalOnSubmit) {
        await externalOnSubmit(formData);
      } else {
        await handleSubmit(formData);
      }
    },
    [validateForm, handleSubmit, formData, externalOnSubmit]
  );

  return { onSubmit };
}
