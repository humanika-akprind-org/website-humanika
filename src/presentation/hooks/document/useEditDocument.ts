import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  UpdateDocumentInput,
  Document,
} from "@/domain/entities/document.entity";
import { DocumentApi } from "@/presentation/services/document";
import { Status } from "@/domain/enums/status.enum";

export function useEditDocument(
  id: string,
  redirectPath: string = "/admin/administration/documents",
) {
  const router = useRouter();
  const [document, setDocument] = useState<Document | null>(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDocument = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const doc = await DocumentApi.getDocument(id);
        setDocument(doc);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    fetchDocument();
  }, [id]);

  const updateDocument = async (data: UpdateDocumentInput) => {
    if (!document) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await DocumentApi.updateDocument(document.id, data);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateDocumentForApproval = async (data: UpdateDocumentInput) => {
    if (!document) return;
    setIsSubmitting(true);
    setError(null);
    try {
      await DocumentApi.updateDocument(document.id, {
        ...data,
        status: Status.PENDING,
      });
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push(redirectPath);
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
