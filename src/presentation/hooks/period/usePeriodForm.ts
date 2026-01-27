import { useState, useEffect } from "react";
import type { Period, PeriodFormData } from "@/types/period";

export function usePeriodForm(period?: Period) {
  const [formData, setFormData] = useState<PeriodFormData>({
    name: "",
    startYear: new Date().getFullYear(),
    endYear: new Date().getFullYear() + 1,
    isActive: false,
  });

  const [formErrors, setFormErrors] = useState<
    Partial<Record<keyof PeriodFormData, string>>
  >({});

  useEffect(() => {
    if (period) {
      setFormData({
        name: period.name,
        startYear: period.startYear,
        endYear: period.endYear,
        isActive: period.isActive,
      });
    }
  }, [period]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox"
          ? checked
          : type === "number"
          ? parseInt(value)
          : value,
    }));

    // Clear error when field is changed
    if (formErrors[name as keyof PeriodFormData]) {
      setFormErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const errors: Partial<Record<keyof PeriodFormData, string>> = {};

    if (!formData.name.trim()) errors.name = "Name is required";
    if (
      !formData.startYear ||
      formData.startYear < 2000 ||
      formData.startYear > 2100
    ) {
      errors.startYear = "Start year must be between 2000 and 2100";
    }
    if (
      !formData.endYear ||
      formData.endYear < 2001 ||
      formData.endYear > 2101
    ) {
      errors.endYear = "End year must be between 2001 and 2101";
    }
    if (formData.startYear >= formData.endYear) {
      errors.endYear = "End year must be greater than start year";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  return {
    formData,
    formErrors,
    handleChange,
    validateForm,
  };
}
