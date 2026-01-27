import { useState, useEffect } from "react";
import type { DocumentType } from "@/domain/value-objects/document-type";
import { getDocumentTypes } from "@/presentation/services/document-type";

export function useDocumentTypes() {
  const [documentTypes, setDocumentTypes] = useState<DocumentType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDocumentTypes = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDocumentTypes();
      setDocumentTypes(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch document types",
      );
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchDocumentTypes();
  }, []);

  const refetch = () => {
    fetchDocumentTypes();
  };

  return {
    documentTypes,
    isLoading,
    error,
    refetch,
  };
}
