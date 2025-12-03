import { useRouter } from "next/navigation";
import type { Period } from "@/types/period";
import { usePeriodForm } from "./usePeriodForm";
import { usePeriodSubmit } from "./usePeriodSubmit";
import { usePeriodFormSubmit } from "./usePeriodFormSubmit";

export function usePeriodFormLogic(period?: Period, isEdit: boolean = false) {
  const router = useRouter();

  const { formData, formErrors, handleChange, validateForm } =
    usePeriodForm(period);
  const { isSubmitting, alert, handleSubmit } = usePeriodSubmit(isEdit, period);
  const { onSubmit } = usePeriodFormSubmit({
    validateForm,
    handleSubmit,
    formData,
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
    onSubmit,
    handleBack,

    // Edit mode
    isEdit,
  };
}
