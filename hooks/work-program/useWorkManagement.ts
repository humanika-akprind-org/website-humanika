import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import {
  getWorkPrograms,
  deleteWorkProgram,
  deleteWorkPrograms,
} from "@/use-cases/api/work";
import type { WorkProgram } from "@/types/work";
import { type Department, type Status } from "@/types/enums";

export function useWorkManagement() {
  const router = useRouter();
  const [allWorkPrograms, setAllWorkPrograms] = useState<WorkProgram[]>([]);
  const [workPrograms, setWorkPrograms] = useState<WorkProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedPrograms, setSelectedPrograms] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<Record<string, string>>({
    status: "all",
    department: "all",
    period: "all",
    isActive: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentProgram, setCurrentProgram] = useState<WorkProgram | null>(
    null
  );

  const fetchAllWorkPrograms = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getWorkPrograms();
      setAllWorkPrograms(data);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch work programs"
      );
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering and pagination
  useEffect(() => {
    let filtered = allWorkPrograms;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (program) =>
          program.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          (program.goal &&
            program.goal
              .toLowerCase()
              .includes(debouncedSearchTerm.toLowerCase()))
      );
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (program) => program.status === (filters.status as Status)
      );
    }

    // Department filter
    if (filters.department && filters.department !== "all") {
      filtered = filtered.filter(
        (program) => program.department === (filters.department as Department)
      );
    }

    // Period filter
    if (filters.periodId && filters.periodId !== "all") {
      filtered = filtered.filter(
        (program) => program.periodId === filters.periodId
      );
    }

    // Active status filter (for responsible user)
    if (filters.isActive && filters.isActive !== "all") {
      const isActive = filters.isActive === "active";
      filtered = filtered.filter(
        (program) => program.responsible?.isActive === isActive
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedPrograms = filtered.slice(startIndex, endIndex);

    setWorkPrograms(paginatedPrograms);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [
    allWorkPrograms,
    debouncedSearchTerm,
    currentPage,
    filters.status,
    filters.department,
    filters.period,
    filters.isActive,
    filters.periodId,
  ]);

  useEffect(() => {
    fetchAllWorkPrograms();
  }, [fetchAllWorkPrograms]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleProgramSelection = (id: string) => {
    if (selectedPrograms.includes(id)) {
      setSelectedPrograms(
        selectedPrograms.filter((programId) => programId !== id)
      );
    } else {
      setSelectedPrograms([...selectedPrograms, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedPrograms.length === workPrograms.length) {
      setSelectedPrograms([]);
    } else {
      setSelectedPrograms(workPrograms.map((program) => program.id));
    }
  };

  const handleViewProgram = (id: string) => {
    const program = workPrograms.find((p) => p.id === id);
    if (program) {
      setCurrentProgram(program);
      setShowViewModal(true);
    }
  };

  const handleAddProgram = () => {
    router.push("/admin/program/works/add");
  };

  const handleEditProgram = (id: string) => {
    router.push(`/admin/program/works/edit/${id}`);
  };

  const handleDelete = (program?: WorkProgram) => {
    if (program) {
      setCurrentProgram(program);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      if (currentProgram) {
        await deleteWorkProgram(currentProgram.id);
        setSuccess("Work program deleted successfully");
        fetchAllWorkPrograms();
      } else if (selectedPrograms.length > 0) {
        const validIds = selectedPrograms.filter(
          (id) =>
            id &&
            typeof id === "string" &&
            id.trim() !== "" &&
            id !== "undefined"
        );
        if (validIds.length > 0) {
          await deleteWorkPrograms(validIds);
          setSuccess(`${validIds.length} work programs deleted successfully`);
          setSelectedPrograms([]);
          fetchAllWorkPrograms();
        }
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to delete work program(s)"
      );
    } finally {
      setShowDeleteModal(false);
      setCurrentProgram(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    workPrograms,
    allWorkPrograms,
    loading,
    error,
    success,
    selectedPrograms,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentProgram,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentProgram,
    toggleProgramSelection,
    toggleSelectAll,
    handleViewProgram,
    handleAddProgram,
    handleEditProgram,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  };
}
