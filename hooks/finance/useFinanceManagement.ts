import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteFinance } from "@/use-cases/api/finance";
import type { Finance } from "@/types/finance";
import { useFinances } from "./useFinances";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
  deleteGoogleDriveFile,
} from "@/lib/google-drive/file-utils";

export function useFinanceManagement() {
  const router = useRouter();
  const { finances, isLoading, error, refetch } = useFinances();
  const [allFinances, setAllFinances] = useState<Finance[]>([]);

  const [selectedFinances, setSelectedFinances] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter] = useState("all");
  const [typeFilter] = useState("all");
  const [categoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [workProgramFilter, setWorkProgramFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Store all finances for bulk operations
  useEffect(() => {
    setAllFinances(finances);
  }, [finances]);

  // Apply client-side filtering and pagination
  const filteredFinances = allFinances.filter((finance) => {
    const matchesSearch =
      finance.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (finance.description &&
        finance.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()));

    const matchesStatus =
      statusFilter === "all" || finance.status === statusFilter;
    const matchesType = typeFilter === "all" || finance.type === typeFilter;
    const matchesCategory =
      categoryFilter === "all" || finance.categoryId === categoryFilter;
    const matchesPeriod =
      periodFilter === "all" ||
      finance.date.getFullYear().toString() === periodFilter;
    const matchesWorkProgram =
      workProgramFilter === "all" ||
      finance.workProgramId === workProgramFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesType &&
      matchesCategory &&
      matchesPeriod &&
      matchesWorkProgram
    );
  });

  useEffect(() => {
    setTotalPages(Math.ceil(filteredFinances.length / 10));
  }, [filteredFinances, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleFinanceSelection = (id: string) => {
    if (selectedFinances.includes(id)) {
      setSelectedFinances(
        selectedFinances.filter((financeId) => financeId !== id),
      );
    } else {
      setSelectedFinances([...selectedFinances, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedFinances.length === filteredFinances.length) {
      setSelectedFinances([]);
    } else {
      setSelectedFinances(filteredFinances.map((finance) => finance.id));
    }
  };

  const handleAddFinance = () => {
    router.push("/admin/finance/transactions/add");
  };

  const handleEditFinance = (id: string) => {
    router.push(`/admin/finance/transactions/edit/${id}`);
  };

  const handleViewFinance = (finance: Finance) => {
    setCurrentFinance(finance);
    setShowViewModal(true);
  };

  const handleDelete = (finance?: Finance) => {
    if (finance) {
      setCurrentFinance(finance);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Get access token for Google Drive operations
      const accessToken = await getAccessTokenAction();

      if (currentFinance) {
        // Single finance deletion: Delete file from Google Drive first, then delete database record
        if (currentFinance.proof && isGoogleDriveFile(currentFinance.proof)) {
          const fileId = getFileIdFromFile(currentFinance.proof);
          if (fileId) {
            await deleteGoogleDriveFile(fileId, accessToken);
          }
        }
        await deleteFinance(currentFinance.id);
        setSuccess("Finance deleted successfully");
        refetch();
      } else if (selectedFinances.length > 0) {
        // Bulk deletion: Delete files from Google Drive first, then delete database records
        for (const financeId of selectedFinances) {
          // Find the finance object to get the proof URL (use allFinances to ensure data is available)
          const financeToDelete = allFinances.find((f) => f.id === financeId);
          if (
            financeToDelete?.proof &&
            isGoogleDriveFile(financeToDelete.proof)
          ) {
            const fileId = getFileIdFromFile(financeToDelete.proof);
            if (fileId) {
              await deleteGoogleDriveFile(fileId, accessToken);
            }
          }
          await deleteFinance(financeId);
        }
        setSelectedFinances([]);
        setSuccess(`${selectedFinances.length} finances deleted successfully`);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting finance:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentFinance(null);
    }
  };

  return {
    finances: filteredFinances,
    loading: isLoading,
    error,
    success,
    selectedFinances,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentFinance,
    periodFilter,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentFinance,
    setPeriodFilter,
    toggleFinanceSelection,
    toggleSelectAll,
    handleAddFinance,
    handleEditFinance,
    handleViewFinance,
    handleDelete,
    confirmDelete,
    workProgramFilter,
    setWorkProgramFilter,
  };
}
