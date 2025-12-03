import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type { Period } from "@/types/period";
import { getPeriods, deletePeriod } from "@/use-cases/api/period";

export function usePeriodManagement() {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [filteredPeriods, setFilteredPeriods] = useState<Period[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [selectedPeriods, setSelectedPeriods] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    status: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentPeriod, setCurrentPeriod] = useState<Period | null>(null);

  const itemsPerPage = 10;

  const filterPeriods = useCallback(() => {
    let result = [...periods];

    // Apply search filter
    if (searchTerm) {
      result = result.filter((period) =>
        period.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // Apply status filter
    if (filters.status !== "all") {
      result = result.filter((period) => {
        if (filters.status === "ACTIVE") return period.isActive;
        if (filters.status === "INACTIVE") return !period.isActive;
        return true;
      });
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    const paginatedResult = result.slice(startIndex, endIndex);

    setFilteredPeriods(paginatedResult);
    setTotalPages(Math.ceil(result.length / itemsPerPage));
  }, [periods, searchTerm, filters, currentPage]);

  useEffect(() => {
    filterPeriods();
  }, [filterPeriods]);

  const loadPeriods = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getPeriods();
      setPeriods(data);
    } catch (err) {
      setError("Failed to load periods");
      console.error("Error loading periods:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPeriods();
  }, []);

  const togglePeriodSelection = (id: string) => {
    if (selectedPeriods.includes(id)) {
      setSelectedPeriods(selectedPeriods.filter((periodId) => periodId !== id));
    } else {
      setSelectedPeriods([...selectedPeriods, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPeriods.length === filteredPeriods.length) {
      setSelectedPeriods([]);
    } else {
      setSelectedPeriods(filteredPeriods.map((period) => period.id));
    }
  };

  const handleAddPeriod = () => {
    router.push("/admin/governance/periods/add");
  };

  const handleViewPeriod = (period: Period) => {
    setCurrentPeriod(period);
    setShowViewModal(true);
  };

  const handleEditPeriod = (period: Period) => {
    router.push(`/admin/governance/periods/edit/${period.id}`);
  };

  const handleDelete = (period?: Period) => {
    if (period) {
      setCurrentPeriod(period);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      setError(null);
      if (currentPeriod) {
        // Delete single period
        await deletePeriod(currentPeriod.id);
        setPeriods(periods.filter((p) => p.id !== currentPeriod.id));
        setSuccess("Period deleted successfully");
      } else if (selectedPeriods.length > 0) {
        // Delete multiple periods
        const deletePromises = selectedPeriods.map((id) => deletePeriod(id));
        await Promise.all(deletePromises);
        setPeriods(periods.filter((p) => !selectedPeriods.includes(p.id)));
        setSelectedPeriods([]);
        setSuccess(`${selectedPeriods.length} periods deleted successfully`);
      }
      setShowDeleteModal(false);
      setCurrentPeriod(null);

      // Clear success message after 3 seconds
      setTimeout(() => setSuccess(null), 3000);
    } catch (err) {
      setError("Failed to delete period(s)");
      console.error("Error deleting period:", err);
    }
  };

  const handleFilterChange = (newFilters: Partial<typeof filters>) => {
    setFilters({ ...filters, ...newFilters });
    setCurrentPage(1); // Reset to first page when filters change
  };

  return {
    periods,
    filteredPeriods,
    loading,
    error,
    success,
    selectedPeriods,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentPeriod,

    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentPeriod,
    togglePeriodSelection,
    toggleSelectAll,

    handleViewPeriod,
    handleAddPeriod,
    handleEditPeriod,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  };
}
