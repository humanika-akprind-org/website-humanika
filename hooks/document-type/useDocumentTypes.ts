import { useState, useEffect } from "react";
import type { DocumentType } from "@/types/document-type";
import { getDocumentTypes } from "@/use-cases/api/document-type";

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
        err instanceof Error ? err.message : "Failed to fetch document types"
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
