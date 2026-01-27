import { useState } from "react";
import type {
  DocumentType,
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";

interface UseDocumentTypeFormProps {
  category?: DocumentType;
  onSubmit: (
    data: CreateDocumentTypeInput | UpdateDocumentTypeInput
  ) => Promise<void>;
}

export function useDocumentTypeForm({
  category,
  onSubmit,
}: UseDocumentTypeFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: category?.name || "",
    description: category?.description || "",
  });
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const validateForm = () => {
    const errors: { [key: string]: string } = {};

    if (!formData.name.trim()) {
      errors.name = "Type name is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error("Form submission error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    formData,
    formErrors,
    handleChange,
    handleSubmit,
  };
}
