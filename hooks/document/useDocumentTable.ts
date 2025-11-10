import { useState } from "react";
import type { Document } from "@/types/document";
import type { Status, DocumentType } from "@/types/enums";

export interface UseDocumentTableProps {
  documents: Document[];
  onDelete: (id: string, name: string) => void;
}

export interface UseDocumentTableReturn {
  // Filter states
  searchTerm: string;
  setSearchTerm: (term: string) => void;
  statusFilter: Status | "all";
  setStatusFilter: (status: Status | "all") => void;
  typeFilter: DocumentType | "all";
  setTypeFilter: (type: DocumentType | "all") => void;
  userFilter: string;
  setUserFilter: (user: string) => void;

  // Selection states
  selectedDocuments: string[];
  setSelectedDocuments: (documents: string[]) => void;
  toggleDocumentSelection: (id: string) => void;
  selectAllDocuments: () => void;
  clearSelection: () => void;

  // Delete modal states
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (open: boolean) => void;
  documentToDelete: Document | null;
  setDocumentToDelete: (document: Document | null) => void;
  isBulkDelete: boolean;
  setIsBulkDelete: (bulk: boolean) => void;

  // Computed values
  filteredDocuments: Document[];

  // Actions
  handleDelete: (document: Document) => void;
  handleBulkDelete: () => void;
  handleConfirmDelete: () => void;
  handleCloseDeleteModal: () => void;
}

export function useDocumentTable({
  documents,
  onDelete,
}: UseDocumentTableProps): UseDocumentTableReturn {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [userFilter, setUserFilter] = useState<string>("all");

  // Selection states
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);

  // Delete modal states
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || document.status === statusFilter;

    const matchesType = typeFilter === "all" || document.type === typeFilter;

    const matchesUser = userFilter === "all" || document.user.id === userFilter;

    return matchesSearch && matchesStatus && matchesType && matchesUser;
  });

  // Selection actions
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(id)
        ? prev.filter((documentId) => documentId !== id)
        : [...prev, id]
    );
  };

  const selectAllDocuments = () => {
    setSelectedDocuments(filteredDocuments.map((document) => document.id));
  };

  const clearSelection = () => {
    setSelectedDocuments([]);
  };

  // Delete actions
  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const handleBulkDelete = () => {
    if (selectedDocuments.length === 0) return;
    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedDocuments.forEach((id) => {
        const doc = documents.find((d) => d.id === id);
        if (doc) onDelete(id, doc.name);
      });
      setSelectedDocuments([]);
    } else if (documentToDelete) {
      onDelete(documentToDelete.id, documentToDelete.name);
    }
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
    setIsBulkDelete(false);
  };

  return {
    // Filter states
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
    typeFilter,
    setTypeFilter,
    userFilter,
    setUserFilter,

    // Selection states
    selectedDocuments,
    setSelectedDocuments,
    toggleDocumentSelection,
    selectAllDocuments,
    clearSelection,

    // Delete modal states
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    documentToDelete,
    setDocumentToDelete,
    isBulkDelete,
    setIsBulkDelete,

    // Computed values
    filteredDocuments,

    // Actions
    handleDelete,
    handleBulkDelete,
    handleConfirmDelete,
    handleCloseDeleteModal,
  };
}
