import { useState, useMemo } from "react";
import type { Management } from "@/types/management";
import { Department, Position } from "@/types/enums";
import { useFileOperations } from "@/hooks/drive/form/useFileOperations";
import { ManagementApi } from "@/use-cases/api/management";

export const useManagementTable = (
  managements: Management[],
  accessToken: string
) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [positionFilter, setPositionFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);

  const handleDeleteSelected = () => {
    if (selectedManagements.length === 0) return;
    setBulkDeleteModal({ isOpen: true, selectedIds: selectedManagements });
  };

  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    managementId: string | null;
    managementName: string;
    fileId: string | null;
    fileName: string;
  }>({
    isOpen: false,
    managementId: null,
    managementName: "",
    fileId: null,
    fileName: "",
  });

  const [bulkDeleteModal, setBulkDeleteModal] = useState<{
    isOpen: boolean;
    selectedIds: string[];
  }>({
    isOpen: false,
    selectedIds: [],
  });

  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  // Use the file operations hook
  const {
    isLoading: isOperating,
    error: operationError,
    deleteFile,
  } = useFileOperations();

  // Helper function to extract file ID from Google Drive URL
  const extractFileId = (url: string): string | null => {
    if (!url) return null;

    // Handle direct file IDs
    if (url.length === 33 && !url.includes("/")) {
      return url;
    }

    // Handle Google Drive URLs
    const patterns = [
      /\/file\/d\/([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
      /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of patterns) {
      const match = url.match(pattern);
      if (match && match[1]) {
        return match[1];
      }
    }

    return null;
  };

  // Generate proxy image URL
  const getProxyImageUrl = (photoUrl: string | null): string | null => {
    if (!photoUrl) return null;

    const fileId = extractFileId(photoUrl);
    if (!fileId) return null;

    return `/api/drive-image?fileId=${fileId}${
      accessToken ? `&accessToken=${accessToken}` : ""
    }`;
  };

  // Check if image has errored
  const hasImageError = (url: string | null): boolean => {
    if (!url) return true;
    return imageErrors.has(url);
  };

  // Handle image error
  const handleImageError = (url: string) => {
    setImageErrors((prev) => new Set(prev).add(url));
  };

  const handleDelete = (management: Management) => {
    setDeleteModal({
      isOpen: true,
      managementId: management.id,
      managementName: `${management.user?.name} - ${getPositionLabel(
        management.position
      )}`,
      fileId: null,
      fileName: "",
    });
  };

  const handledeleteFile = (fileId: string, fileName: string) => {
    setDeleteModal({
      isOpen: true,
      managementId: null,
      managementName: "",
      fileId,
      fileName,
    });
  };

  const confirmDelete = async () => {
    if (deleteModal.fileId) {
      // Handle file deletion using the hook
      const success = await deleteFile({
        fileId: deleteModal.fileId,
        accessToken: accessToken || "",
      });

      if (success) {
        // Find the management record that contains this file
        const managementToUpdate = managements.find((m) => {
          const fileId = extractFileId(m.photo || "");
          return fileId === deleteModal.fileId;
        });

        if (managementToUpdate) {
          // Update the management record to remove the photo URL
          await ManagementApi.updateManagement(managementToUpdate.id, {
            userId: managementToUpdate.userId,
            periodId: managementToUpdate.periodId,
            position: managementToUpdate.position,
            department: managementToUpdate.department,
            photo: null,
          });
        }

        // Refresh the page to show updated data
        window.location.reload();
      }
    } else if (deleteModal.managementId) {
      // Handle management deletion
      try {
        await ManagementApi.deleteManagement(
          deleteModal.managementId as string,
          accessToken
        );
        // Refresh the page after successful deletion
        window.location.reload();
      } catch (error) {
        console.error("Error deleting management:", error);
      }
    }

    setDeleteModal({
      isOpen: false,
      managementId: null,
      managementName: "",
      fileId: null,
      fileName: "",
    });
  };

  // Confirm bulk delete
  const confirmBulkDelete = async () => {
    if (bulkDeleteModal.selectedIds.length === 0) return;

    try {
      for (const id of bulkDeleteModal.selectedIds) {
        await ManagementApi.deleteManagement(id, accessToken);
      }
      window.location.reload();
    } catch (error) {
      console.error("Error deleting managements:", error);
    } finally {
      setBulkDeleteModal({ isOpen: false, selectedIds: [] });
      setSelectedManagements([]);
    }
  };

  const getDepartmentLabel = (department: Department) =>
    Department[department] || department;

  const getPositionLabel = (position: Position) =>
    Position[position] || position;

  // Filter managements based on selected filters and search term
  const filteredManagements = useMemo(
    () =>
      managements.filter(
        (management) =>
          (departmentFilter === "all" ||
            management.department === departmentFilter) &&
          (periodFilter === "all" ||
            management.period?.name === periodFilter) &&
          (positionFilter === "all" ||
            management.position === positionFilter) &&
          (!searchTerm ||
            management.user?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            management.user?.email
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            getPositionLabel(management.position)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            getDepartmentLabel(management.department)
              .toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            management.period?.name
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()))
      ),
    [managements, departmentFilter, periodFilter, positionFilter, searchTerm]
  );

  // Stats for departments INFOKOM, PSDM, LITBANG, KWU based on filtered managements
  const departmentStats = useMemo(() => {
    const stats = {
      INFOKOM: 0,
      PSDM: 0,
      LITBANG: 0,
      KWU: 0,
    };

    filteredManagements.forEach((management) => {
      switch (management.department) {
        case Department.INFOKOM:
          stats.INFOKOM += 1;
          break;
        case Department.PSDM:
          stats.PSDM += 1;
          break;
        case Department.LITBANG:
          stats.LITBANG += 1;
          break;
        case Department.KWU:
          stats.KWU += 1;
          break;
      }
    });

    return stats;
  }, [filteredManagements]);

  // Group by department for better organization
  const groupedManagements = useMemo(
    () =>
      filteredManagements.reduce(
        (acc, management) => ({
          ...acc,
          [management.department]: [
            ...(acc[management.department] || []),
            management,
          ],
        }),
        {} as Record<string, Management[]>
      ),
    [filteredManagements]
  );

  // Sort departments alphabetically
  const sortedDepartments = useMemo(
    () => Object.keys(groupedManagements).sort(),
    [groupedManagements]
  );

  return {
    // States
    searchTerm,
    setSearchTerm,
    positionFilter,
    setPositionFilter,
    periodFilter,
    setPeriodFilter,
    departmentFilter,
    setDepartmentFilter,
    selectedManagements,
    setSelectedManagements,
    deleteModal,
    setDeleteModal,
    bulkDeleteModal,
    setBulkDeleteModal,
    imageErrors,
    setImageErrors,
    isOperating,
    operationError,

    // Computed
    filteredManagements,
    departmentStats,
    groupedManagements,
    sortedDepartments,

    // Functions
    handleDeleteSelected,
    handleDelete,
    handledeleteFile,
    confirmDelete,
    confirmBulkDelete,
    getDepartmentLabel,
    getPositionLabel,
    extractFileId,
    getProxyImageUrl,
    hasImageError,
    handleImageError,
  };
};
