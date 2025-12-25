import { useState } from "react";
import type {
  ArticleCategory,
  CreateArticleCategoryInput,
  UpdateArticleCategoryInput,
} from "@/types/article-category";

export interface ArticleCategoryFormData {
  name: string;
  description: string;
}

export const useArticleCategoryForm = (
  category?: ArticleCategory,
  onSubmit?: (
    data: CreateArticleCategoryInput | UpdateArticleCategoryInput
  ) => Promise<void>
) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState<ArticleCategoryFormData>({
    name: category?.name || "",
    description: category?.description || "",
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when field is changed
    if (formErrors[name as keyof ArticleCategoryFormData]) {
      setFormErrors((prev) => {
        const { [name]: _, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    if (!formData.name.trim()) errors.name = "Category name is required";

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
    validateForm,
    handleSubmit,
  };
};
