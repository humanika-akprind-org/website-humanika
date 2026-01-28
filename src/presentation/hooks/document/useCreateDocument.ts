import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/domain/entities/document.entity";
import { DocumentApi } from "@/presentation/services/document";
import { Status } from "@/domain/enums/status.enum";

export function useCreateDocument(
  redirectPath: string = "/admin/administration/documents",
) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createDocument = async (
    data: CreateDocumentInput | UpdateDocumentInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateDocumentInput = {
        name: data.name || "",
        documentTypeId: data.documentTypeId || "",
        letterId: data.letterId,
        document: data.document,
        periodId: data.periodId,
        status: Status.DRAFT,
      };
      await DocumentApi.createDocument(input);
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createDocumentForApproval = async (
    data: CreateDocumentInput | UpdateDocumentInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateDocumentInput = {
        name: data.name || "",
        documentTypeId: data.documentTypeId || "",
        letterId: data.letterId,
        document: data.document,
        periodId: data.periodId,
        status: Status.PENDING,
      };
      await DocumentApi.createDocument(input);
      // Assuming approval is handled in the API
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
    createDocument,
    createDocumentForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
