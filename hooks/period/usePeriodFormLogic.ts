import { useRouter } from "next/navigation";
import type { Period, PeriodFormData } from "@/types/period";
import { usePeriodForm } from "./usePeriodForm";
import { usePeriodSubmit } from "./usePeriodSubmit";
import { usePeriodFormSubmit } from "./usePeriodFormSubmit";

interface UsePeriodFormLogicOptions {
  period?: Period;
  isEdit?: boolean;
  onSubmit?: (data: PeriodFormData) => Promise<void>;
}

export function usePeriodFormLogic(options: UsePeriodFormLogicOptions = {}) {
  const { period, isEdit = false, onSubmit } = options;
  const router = useRouter();

  const { formData, formErrors, handleChange, validateForm } =
    usePeriodForm(period);
  const { isSubmitting, alert, handleSubmit } = usePeriodSubmit(isEdit, period);
  const { onSubmit: formOnSubmit } = usePeriodFormSubmit({
    validateForm,
    handleSubmit,
    formData,
    onSubmit,
  });

  const handleBack = () => {
    router.back();
  };

  return {
    // Form state
    formData,
    formErrors,
    handleChange,

    // Submission state
    isSubmitting,
    alert,

    // Actions
    onSubmit: formOnSubmit,
    handleBack,

    // Edit mode
    isEdit,
  };
}
