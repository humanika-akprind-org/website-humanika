import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { StructureApi } from "@/use-cases/api/structure";
import { PeriodApi } from "@/use-cases/api/period";
import type { OrganizationalStructure } from "@/types/structure";
import type { Period } from "@/types/period";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
  deleteGoogleDriveFile,
} from "@/lib/google-drive/file-utils";

type StructureFiltersType = {
  status: string;
  periodId: string;
};

export function useStructureManagement() {
  const router = useRouter();
  const [allStructures, setAllStructures] = useState<OrganizationalStructure[]>(
    []
  );
  const [structures, setStructures] = useState<OrganizationalStructure[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedStructures, setSelectedStructures] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState<StructureFiltersType>({
    status: "all",
    periodId: "all",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentStructure, setCurrentStructure] =
    useState<OrganizationalStructure | null>(null);

  const fetchAllStructures = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      // Fetch structures and periods
      const [structuresResponse, periodsResponse] = await Promise.all([
        StructureApi.getStructures(),
        PeriodApi.getPeriods(),
      ]);

      if (structuresResponse.error) {
        setError(structuresResponse.error);
      } else if (structuresResponse.data) {
        const periods: Period[] = Array.isArray(periodsResponse)
          ? periodsResponse
          : periodsResponse
          ? [periodsResponse]
          : [];

        // Enhance structures with period data
        const enhancedStructures = structuresResponse.data.map(
          (structure: OrganizationalStructure) => ({
            ...structure,
            period: periods.find((period) => period.id === structure.periodId),
          })
        );

        setAllStructures(enhancedStructures);
      }
    } catch (_error) {
      setError("Failed to fetch structures");
    } finally {
      setLoading(false);
    }
  }, []);

  // Apply client-side filtering and pagination
  useEffect(() => {
    let filtered = allStructures;

    // Search filter
    if (debouncedSearchTerm) {
      filtered = filtered.filter(
        (structure) =>
          structure.name
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          structure.status
            .toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase()) ||
          structure.period?.name
            ?.toLowerCase()
            .includes(debouncedSearchTerm.toLowerCase())
      );
    }

    // Status filter
    if (filters.status && filters.status !== "all") {
      filtered = filtered.filter(
        (structure) => structure.status === filters.status
      );
    }

    // Period filter
    if (filters.periodId && filters.periodId !== "all") {
      filtered = filtered.filter(
        (structure) => structure.periodId === filters.periodId
      );
    }

    // Apply pagination
    const startIndex = (currentPage - 1) * 10;
    const endIndex = startIndex + 10;
    const paginatedStructures = filtered.slice(startIndex, endIndex);

    setStructures(paginatedStructures);
    setTotalPages(Math.ceil(filtered.length / 10));
  }, [
    allStructures,
    debouncedSearchTerm,
    currentPage,
    filters.status,
    filters.periodId,
  ]);

  useEffect(() => {
    fetchAllStructures();
  }, [fetchAllStructures]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleStructureSelection = (id: string) => {
    if (selectedStructures.includes(id)) {
      setSelectedStructures(
        selectedStructures.filter((structureId) => structureId !== id)
      );
    } else {
      setSelectedStructures([...selectedStructures, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedStructures.length === structures.length) {
      setSelectedStructures([]);
    } else {
      setSelectedStructures(structures.map((structure) => structure.id));
    }
  };

  const handleViewStructure = (id: string) => {
    const structure = structures.find((s) => s.id === id);
    if (structure) {
      setCurrentStructure(structure);
      setShowViewModal(true);
    }
  };

  const handleAddStructure = () => {
    router.push("/admin/governance/structure/add");
  };

  const handleEditStructure = (id: string) => {
    router.push(`/admin/governance/structure/edit/${id}`);
  };

  const handleDelete = (structure?: OrganizationalStructure) => {
    if (structure) {
      setCurrentStructure(structure);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Get access token for Google Drive operations
      const accessToken = await getAccessTokenAction();

      if (currentStructure) {
        // Single structure deletion: Delete file from Google Drive first, then delete database record
        if (
          currentStructure.decree &&
          isGoogleDriveFile(currentStructure.decree)
        ) {
          const fileId = getFileIdFromFile(currentStructure.decree);
          if (fileId) {
            await deleteGoogleDriveFile(fileId, accessToken);
          }
        }
        const response = await StructureApi.deleteStructure(
          currentStructure.id
        );
        if (response.error) {
          setError(response.error);
        } else {
          setSuccess("Structure deleted successfully");
          fetchAllStructures();
        }
      } else if (selectedStructures.length > 0) {
        // Bulk deletion: Delete files from Google Drive first, then delete database records
        for (const structureId of selectedStructures) {
          // Find the structure object to get the decree URL
          const structureToDelete = structures.find(
            (s) => s.id === structureId
          );
          if (
            structureToDelete?.decree &&
            isGoogleDriveFile(structureToDelete.decree)
          ) {
            const fileId = getFileIdFromFile(structureToDelete.decree);
            if (fileId) {
              await deleteGoogleDriveFile(fileId, accessToken);
            }
          }
          await StructureApi.deleteStructure(structureId);
        }
        setSuccess(
          `${selectedStructures.length} structures deleted successfully`
        );
        setSelectedStructures([]);
        fetchAllStructures();
      }
    } catch (_error) {
      setError("Failed to delete structure(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentStructure(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFilterChange = (
    key: keyof StructureFiltersType,
    value: string
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return {
    structures,
    loading,
    error,
    success,
    selectedStructures,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentStructure,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentStructure,
    toggleStructureSelection,
    toggleSelectAll,
    handleViewStructure,
    handleAddStructure,
    handleEditStructure,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  };
}
