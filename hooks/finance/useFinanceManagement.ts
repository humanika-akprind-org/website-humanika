import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteFinance } from "@/use-cases/api/finance";
import type { Finance } from "@/types/finance";
import { useFinances } from "./useFinances";

export function useFinanceManagement() {
  const router = useRouter();
  const { finances, isLoading, error, refetch } = useFinances();

  const [selectedFinances, setSelectedFinances] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [workProgramFilter, setWorkProgramFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentFinance, setCurrentFinance] = useState<Finance | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredFinances = finances.filter((finance) => {
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
        selectedFinances.filter((financeId) => financeId !== id)
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
      if (currentFinance) {
        await deleteFinance(currentFinance.id);
        setSuccess("Finance deleted successfully");
        refetch();
      } else if (selectedFinances.length > 0) {
        for (const financeId of selectedFinances) {
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
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentFinance,
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
