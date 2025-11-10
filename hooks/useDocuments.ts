import { useState, useEffect, useCallback } from "react";
import { getDocuments, deleteDocument } from "@/use-cases/api/document";
import type { Document, DocumentFilter } from "@/types/document";
import { useToast } from "@/hooks/use-toast";

export function useDocuments(filter?: DocumentFilter) {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    documentId: "",
    documentName: "",
  });

  const { toast } = useToast();

  const fetchDocuments = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      const data = await getDocuments(filter);
      setDocuments(data || []);
      setFilteredDocuments(data || []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch documents"
      );
      toast({
        title: "Error",
        description: "Failed to fetch documents",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [filter, toast]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleDelete = async (documentId: string) => {
    try {
      await deleteDocument(documentId);
      toast({
        title: "Success",
        description: "Document deleted successfully",
      });
      fetchDocuments(); // Refresh the list
    } catch (error) {
      console.error("Error deleting document:", error);
      toast({
        title: "Error",
        description: "Failed to delete document",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, documentId: "", documentName: "" });
    }
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, documentId: "", documentName: "" });
  };

  const openDeleteModal = (documentId: string, documentName: string) => {
    setDeleteModal({ isOpen: true, documentId, documentName });
  };

  return {
    documents,
    filteredDocuments,
    isLoading,
    error,
    deleteModal,
    fetchDocuments,
    handleDelete,
    closeDeleteModal,
    openDeleteModal,
  };
}
