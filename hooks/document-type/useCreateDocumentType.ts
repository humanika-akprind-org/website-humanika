import { useState } from "react";
import { useRouter } from "next/navigation";
import { createDocumentType } from "@/use-cases/api/document-type";
import type {
  CreateDocumentTypeInput,
  UpdateDocumentTypeInput,
} from "@/types/document-type";

export function useCreateDocumentType() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createDocumentTypeFn = async (
    formData: CreateDocumentTypeInput | UpdateDocumentTypeInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await createDocumentType(formData as CreateDocumentTypeInput);
      router.push("/admin/administration/documents/types");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create document type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createDocumentType: createDocumentTypeFn,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
