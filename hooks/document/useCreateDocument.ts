import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";

export function useCreateDocument() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createDocument = async (
    data: CreateDocumentInput | UpdateDocumentInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "DRAFT",
        }),
      });
      if (!response.ok) throw new Error("Failed to create document");
      router.push("/admin/administration/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createDocumentForApproval = async (
    data: CreateDocumentInput | UpdateDocumentInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/document", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "PENDING",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create document for approval");
      }
      // Assuming approval is handled in the API
      router.push("/admin/administration/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/administration/documents");
  };

  return {
    createDocument,
    createDocumentForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
