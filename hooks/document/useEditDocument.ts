import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UpdateDocumentInput, Document } from "@/types/document";

export function useEditDocument(id: string) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const response = await fetch(`/api/document/${id}`);
        if (!response.ok) throw new Error("Failed to fetch document");
        const data = await response.json();
        setDocument(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDocument();
  }, [id]);

  const updateDocument = async (data: UpdateDocumentInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/document/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update document");
      router.push("/admin/administration/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDocumentForApproval = async (data: UpdateDocumentInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/document/${id}/approve`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        throw new Error("Failed to update document for approval");
      }
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
    document,
    loading,
    error,
    isSubmitting,
    updateDocument,
    updateDocumentForApproval,
    handleBack,
  };
}
