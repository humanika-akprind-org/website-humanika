import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getDocumentTypes,
  deleteDocumentType,
} from "@/use-cases/api/document-type";
import type { DocumentType } from "@/types/document-type";

export function useDocumentTypeManagement() {
  const router = useRouter();
  const [allTypes, setAllTypes] = useState<DocumentType[]>([]);
  const [types, setTypes] = useState<DocumentType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedTypes, setSelectedTypes] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentType, setCurrentType] = useState<DocumentType | null>(null);

  const fetchTypes = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getDocumentTypes();
      setAllTypes(data);
    } catch (_error) {
      setError("Failed to fetch document types");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering and pagination
  useEffect(() => {
    let filtered = allTypes;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (type) =>
          type.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
          (type.description &&
            type.description
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedTypes = filtered.slice(startIndex, endIndex);

    setTypes(paginatedTypes);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [allTypes, debouncedSearchTerm, currentPage]);

  useEffect(() => {
    fetchTypes();
  }, [fetchTypes]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleTypeSelection = (id: string) => {
    if (selectedTypes.includes(id)) {
      setSelectedTypes(selectedTypes.filter((typeId) => typeId !== id));
    } else {
      setSelectedTypes([...selectedTypes, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedTypes.length === types.length) {
      setSelectedTypes([]);
    } else {
      setSelectedTypes(types.map((type) => type.id));
    }
  };

  const handleViewType = (type: DocumentType) => {
    setCurrentType(type);
    setShowViewModal(true);
  };

  const handleAddType = () => {
    router.push("/admin/administration/documents/types/add");
  };

  const handleEditType = (id: string) => {
    router.push(`/admin/administration/documents/types/edit/${id}`);
  };

  const handleDelete = (type?: DocumentType) => {
    if (type) {
      setCurrentType(type);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentType) {
        await deleteDocumentType(currentType.id);
        setSuccess("Document type deleted successfully");
        fetchTypes();
      } else if (selectedTypes.length > 0) {
        for (const typeId of selectedTypes) {
          await deleteDocumentType(typeId);
        }
        setSuccess(
          `${selectedTypes.length} document types deleted successfully`
        );
        setSelectedTypes([]);
        fetchTypes();
      }
    } catch (_error) {
      setError("Failed to delete document type(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentType(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  return {
    types,
    loading,
    error,
    success,
    selectedTypes,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentType,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentType,
    toggleTypeSelection,
    toggleSelectAll,
    handleViewType,
    handleAddType,
    handleEditType,
    handleDelete,
    confirmDelete,
  };
}
