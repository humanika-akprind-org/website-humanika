import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  DocumentType,
  UpdateDocumentTypeInput,
} from "@/types/document-type";

export function useEditDocumentType(id: string) {
  const router = useRouter();
  const [documentType, setDocumentType] = useState<DocumentType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [_isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDocumentType = async () => {
      try {
        const response = await fetch(`/api/document/type/${id}`);
        if (!response.ok) {
          throw new Error("Failed to fetch document type");
        }
        const data = await response.json();
        setDocumentType(data);
      } catch (err) {
        console.error("Error fetching document type:", err);
        setError("Failed to fetch document type");
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchDocumentType();
    }
  }, [id]);

  const updateDocumentType = async (formData: UpdateDocumentTypeInput) => {
    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch(`/api/document/type/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to update document type");
      }

      router.push("/admin/administration/documents/types");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to update document type. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    category: documentType,
    loading: isLoading,
    error,
    updateDocumentType,
    handleBack,
  };
}
