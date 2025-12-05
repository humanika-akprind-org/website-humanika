import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { ManagementApi } from "@/use-cases/api/management";
import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import type { Management } from "@/types/management";

type ManagementFiltersType = {
  department: string;
  position: string;
  periodId: string;
};

export function useManagementManagement() {
  const router = useRouter();
  const [allManagements, setAllManagements] = useState<Management[]>([]);
  const [managements, setManagements] = useState<Management[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<ManagementFiltersType>({
    department: "all",
    position: "all",
    periodId: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentManagement, setCurrentManagement] = useState<Management | null>(
    null
  );

  const fetchAllManagements = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch managements, users, and periods
      const [managementsResponse, usersResponse, periodsResponse] =
        await Promise.all([
          ManagementApi.getManagements(),
          UserApi.getUsers({ allUsers: true }),
          PeriodApi.getPeriods(),
        ]);

      if (usersResponse.error) {
        setError(usersResponse.error);
      } else {
        const users = usersResponse.data?.users || [];
        const periods = periodsResponse;

        // Enhance managements with user and period data
        const enhancedManagements = managementsResponse.map(
          (management: Management) => ({
            ...management,
            user: users.find((user) => user.id === management.userId),
            period: periods.find((period) => period.id === management.periodId),
          })
        );

        setAllManagements(enhancedManagements);
      }
    } catch (_error) {
      setError("Failed to fetch managements");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering and pagination
  useEffect(() => {
    let filtered = allManagements;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (management) =>
          management.user?.name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          management.user?.email
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          management.position
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          management.department
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          management.period?.name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Department filter
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(
        (management) => management.department === filters.department
      );
    }

    // Position filter
    if (filters.position && filters.position !== "all") {
      filtered = filtered.filter(
        (management) => management.position === filters.position
      );
    }

    // Period filter
    if (filters.periodId && filters.periodId !== "all") {
      filtered = filtered.filter(
        (management) => management.periodId === filters.periodId
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedManagements = filtered.slice(startIndex, endIndex);

    setManagements(paginatedManagements);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [
    allManagements,
    debouncedSearchTerm,
    currentPage,
    filters.department,
    filters.position,
    filters.periodId,
  ]);

  useEffect(() => {
    fetchAllManagements();
  }, [fetchAllManagements]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleManagementSelection = (id: string) => {
    if (selectedManagements.includes(id)) {
      setSelectedManagements(
        selectedManagements.filter((managementId) => managementId !== id)
      );
    } else {
      setSelectedManagements([...selectedManagements, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedManagements.length === managements.length) {
      setSelectedManagements([]);
    } else {
      setSelectedManagements(managements.map((management) => management.id));
    }
  };

  const handleViewManagement = (id: string) => {
    const management = managements.find((m) => m.id === id);
    if (management) {
      setCurrentManagement(management);
      setShowViewModal(true);
    }
  };

  const handleAddManagement = () => {
    router.push("/admin/governance/managements/add");
  };

  const handleEditManagement = (id: string) => {
    router.push(`/admin/governance/managements/edit/${id}`);
  };

  const handleDelete = (management?: Management) => {
    if (management) {
      setCurrentManagement(management);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentManagement) {
        await ManagementApi.deleteManagement(currentManagement.id, "");
        setSuccess("Management deleted successfully");
        fetchAllManagements();
      } else if (selectedManagements.length > 0) {
        for (const managementId of selectedManagements) {
          await ManagementApi.deleteManagement(managementId, "");
        }
        setSuccess(
          `${selectedManagements.length} managements deleted successfully`
        );
        setSelectedManagements([]);
        fetchAllManagements();
      }
    } catch (_error) {
      setError("Failed to delete management(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentManagement(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFilterChange = (
    key: keyof ManagementFiltersType,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    managements,
    loading,
    error,
    success,
    selectedManagements,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentManagement,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentManagement,
    toggleManagementSelection,
    toggleSelectAll,
    handleViewManagement,
    handleAddManagement,
    handleEditManagement,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  };
}
