import { useState } from "react";
import type {
  FinanceCategory,
  CreateFinanceCategoryInput,
  UpdateFinanceCategoryInput,
} from "@/types/finance-category";
import { FinanceType } from "@/types/enums";

export interface FinanceCategoryFormData {
  name: string;
  description: string;
  type: FinanceType;
}

export const useFinanceCategoryForm = (
  category?: FinanceCategory,
  onSubmit?: (
    data: CreateFinanceCategoryInput | UpdateFinanceCategoryInput
  ) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<FinanceCategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
    type: category?.type || FinanceType.INCOME,
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (formErrors[name as keyof FinanceCategoryFormData]) {
      setFormErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (formErrors[name as keyof FinanceCategoryFormData]) {
      setFormErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Category name is required";
    if (!formData.type) errors.type = "Category type is required";

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm() || !onSubmit) return;

    setIsSubmitting(true);

    try {
      await onSubmit(formData);
    } catch (err) {
      console.error("Submission error:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    formData,
    setFormData,
    formErrors,
    handleChange,
    handleSelectChange,
    validateForm,
    handleSubmit,
  };
};
