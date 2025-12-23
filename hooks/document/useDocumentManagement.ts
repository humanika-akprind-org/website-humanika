import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteDocument } from "@/use-cases/api/document";
import type { Document } from "@/types/document";
import { useDocuments } from "./useDocuments";

interface UseDocumentManagementOptions {
  addPath?: string;
  editPath?: string;
  excludeTypes?: string[];
}

export function useDocumentManagement(
  options: UseDocumentManagementOptions = {}
) {
  const { addPath, editPath, excludeTypes } = options;
  const router = useRouter();
  const { documents, isLoading, error, fetchDocuments } = useDocuments();

  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentDocument, setCurrentDocument] = useState<Document | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  // Apply client-side filtering and pagination
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch =
      document.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (document.documentType?.name &&
        document.documentType.name
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || document.status === statusFilter;
    const matchesType = typeFilter === "all" || document.type === typeFilter;
    const matchesUser = userFilter === "all" || document.userId === userFilter;
    const notExcluded = !excludeTypes?.some(
      (excludeType) =>
        excludeType === document.type.toLowerCase().replace(/[\s\-]/g, "")
    );

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesUser &&
      notExcluded
    );
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredDocuments.length / 10));
  }, [filteredDocuments, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleDocumentSelection = (id: string) => {
    if (selectedDocuments.includes(id)) {
      setSelectedDocuments(selectedDocuments.filter((docId) => docId !== id));
    } else {
      setSelectedDocuments([...selectedDocuments, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedDocuments.length === filteredDocuments.length) {
      setSelectedDocuments([]);
    } else {
      setSelectedDocuments(filteredDocuments.map((doc) => doc.id));
    }
  };

  const handleAddDocument = () => {
    router.push(addPath || "/admin/administration/documents/add");
  };

  const handleEditDocument = (id: string) => {
    router.push(editPath || `/admin/administration/documents/edit/${id}`);
  };

  const handleViewDocument = (document: Document) => {
    setCurrentDocument(document);
    setShowViewModal(true);
  };

  const handleDelete = (document?: Document) => {
    if (document) {
      setCurrentDocument(document);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentDocument) {
        await deleteDocument(currentDocument.id);
        setSuccess("Document deleted successfully");
        fetchDocuments();
      } else if (selectedDocuments.length > 0) {
        for (const docId of selectedDocuments) {
          await deleteDocument(docId);
        }
        setSelectedDocuments([]);
        setSuccess(
          `${selectedDocuments.length} documents deleted successfully`
        );
        fetchDocuments();
      }
    } catch (error) {
      console.error("Error deleting document:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentDocument(null);
    }
  };

  return {
    documents: filteredDocuments,
    loading: isLoading,
    error,
    success,
    selectedDocuments,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentDocument,
    statusFilter,
    typeFilter,
    userFilter,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentDocument,
    setStatusFilter,
    setTypeFilter,
    setUserFilter,
    toggleDocumentSelection,
    toggleSelectAll,
    handleAddDocument,
    handleEditDocument,
    handleViewDocument,
    handleDelete,
    confirmDelete,
  };
}
