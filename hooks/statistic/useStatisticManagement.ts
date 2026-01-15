import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteStatistic } from "@/use-cases/api/statistic";
import type { Statistic } from "@/types/statistic";
import { useStatistics } from "./useStatistics";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import { getCurrentUserAction } from "@/lib/actions/getCurrentUser";

export function useStatisticManagement() {
  const router = useRouter();
  const { statistics, isLoading, error, refetch } = useStatistics();

  const [selectedStatistics, setSelectedStatistics] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentStatistic, setCurrentStatistic] = useState<Statistic | null>(
    null
  );
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredStatistics = statistics.filter((statistic) =>
    statistic.period?.name
      ?.toLowerCase()
      .includes(debouncedSearchTerm.toLowerCase())
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredStatistics.length / 10));
  }, [filteredStatistics, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleStatisticSelection = (id: string) => {
    if (selectedStatistics.includes(id)) {
      setSelectedStatistics(
        selectedStatistics.filter((statId) => statId !== id)
      );
    } else {
      setSelectedStatistics([...selectedStatistics, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStatistics.length === filteredStatistics.length) {
      setSelectedStatistics([]);
    } else {
      setSelectedStatistics(filteredStatistics.map((s) => s.id));
    }
  };

  const handleAddStatistic = () => {
    router.push("/admin/content/statistics/add");
  };

  const handleEditStatistic = (id: string) => {
    router.push(`/admin/content/statistics/edit/${id}`);
  };

  const handleViewStatistic = (statistic: Statistic) => {
    setCurrentStatistic(statistic);
    setShowViewModal(true);
  };

  const handleDelete = (statistic?: Statistic) => {
    if (statistic) {
      setCurrentStatistic(statistic);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      const user = await getCurrentUserAction();
      if (!user) {
        throw new Error("User not found");
      }

      if (currentStatistic) {
        // Single statistic deletion
        await deleteStatistic(currentStatistic.id);
        setSuccess("Statistic deleted successfully");
        refetch();
      } else if (selectedStatistics.length > 0) {
        // Bulk deletion
        for (const statisticId of selectedStatistics) {
          await deleteStatistic(statisticId);
        }
        setSelectedStatistics([]);
        setSuccess(
          `${selectedStatistics.length} statistics deleted successfully`
        );
        refetch();
      }
    } catch (err) {
      console.error("Error deleting statistic:", err);
    } finally {
      setShowDeleteModal(false);
      setCurrentStatistic(null);
    }
  };

  const handleCreateStatistic = async (data: Partial<Statistic>) => {
    try {
      const token = await getAccessTokenAction();
      const response = await fetch("/api/statistics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create statistic");
      }

      const newStatistic = await response.json();
      setSuccess("Statistic created successfully");
      refetch();
      return newStatistic;
    } catch (err) {
      console.error("Error creating statistic:", err);
      throw err;
    }
  };

  const handleUpdateStatistic = async (
    id: string,
    data: Partial<Statistic>
  ) => {
    try {
      const token = await getAccessTokenAction();
      const response = await fetch(`/api/statistics/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update statistic");
      }

      const updatedStatistic = await response.json();
      setSuccess("Statistic updated successfully");
      refetch();
      return updatedStatistic;
    } catch (err) {
      console.error("Error updating statistic:", err);
      throw err;
    }
  };

  return {
    statistics: filteredStatistics,
    loading: isLoading,
    error,
    success,
    selectedStatistics,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentStatistic,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentStatistic,
    setError: (_msg: string | null) => {},
    setSuccess: (_msg: string | null) => {},
    toggleStatisticSelection,
    toggleSelectAll,
    handleAddStatistic,
    handleEditStatistic,
    handleViewStatistic,
    handleDelete,
    confirmDelete,
    handleCreateStatistic,
    handleUpdateStatistic,
  };
}
