"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import type { Management } from "@/types/management";
import { Department, Position } from "@/types/enums";
import DeleteModal from "./modal/DeleteModal";
import { ManagementApi } from "@/lib/api/management";
import { useFileOperations } from "@/hooks/drive/form/useFileOperations";
import PeriodFilters from "./Filters";
import ManagementStats from "./Stats";

interface ManagementTableProps {
  managements: Management[];
  accessToken: string;
}

const ManagementTable: React.FC<ManagementTableProps> = ({
  managements,
  accessToken,
}) => {
  // Filter states
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedManagements, setSelectedManagements] = useState<string[]>([]);

  // Computed filter values
  const filterIsActive =
    statusFilter === "all"
      ? "all"
      : statusFilter === "ACTIVE"
      ? "active"
      : "inactive";

  const handleDeleteSelected = () => {
    // Handle bulk delete logic here
    console.log("Delete selected managements:", selectedManagements);
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
          (filterIsActive === "all" ||
            (filterIsActive === "active" && management.period?.isActive) ||
            (filterIsActive === "inactive" && !management.period?.isActive)) &&
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
    [managements, departmentFilter, periodFilter, filterIsActive, searchTerm]
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

  return (
    <div className="rounded-xl">
      <ManagementStats departmentStats={departmentStats} />

      <PeriodFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        selectedCount={selectedManagements.length}
        onDeleteSelected={handleDeleteSelected}
      />
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            {filteredManagements.length} of {managements.length} members
          </p>
        </div>
      </div>
      {operationError && (
        <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-100">
          <h3 className="font-medium">Error</h3>
          <p className="text-sm">{operationError}</p>
        </div>
      )}
      {/* Management Cards by Department */}
      <div className="space-y-8">
        {sortedDepartments.length > 0 ? (
          sortedDepartments.map((department) => (
            <div
              key={department}
              className="bg-white rounded-xl shadow-sm border border-gray-100"
            >
              {/* Department Header */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800">
                  {getDepartmentLabel(department as Department)}
                </h2>
                <p className="text-sm text-gray-500">
                  {groupedManagements[department].length} members
                </p>
              </div>

              {/* Management Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
                {groupedManagements[department]
                  .sort(
                    (a, b) =>
                      Object.values(Position).indexOf(a.position) -
                      Object.values(Position).indexOf(b.position)
                  )
                  .map((management) => {
                    const proxyImageUrl = getProxyImageUrl(
                      management.photo || ""
                    );
                    const hasError = proxyImageUrl
                      ? hasImageError(proxyImageUrl)
                      : true;

                    return (
                      <div
                        key={management.id}
                        className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                      >
                        <div className="flex items-start space-x-4">
                          {/* Checkbox */}
                          <div className="flex-shrink-0 pt-1">
                            <input
                              type="checkbox"
                              checked={selectedManagements.includes(
                                management.id
                              )}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedManagements([
                                    ...selectedManagements,
                                    management.id,
                                  ]);
                                } else {
                                  setSelectedManagements(
                                    selectedManagements.filter(
                                      (id) => id !== management.id
                                    )
                                  );
                                }
                              }}
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                            />
                          </div>

                          {/* Photo */}
                          <div className="flex-shrink-0 relative">
                            {proxyImageUrl && !hasError ? (
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                                <Image
                                  src={proxyImageUrl}
                                  alt={management.user?.name || "Management"}
                                  width={64}
                                  height={64}
                                  className="w-full h-full object-cover rounded-full"
                                  onError={() =>
                                    handleImageError(proxyImageUrl)
                                  }
                                  unoptimized={true}
                                />
                              </div>
                            ) : (
                              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                                <svg
                                  className="w-8 h-8 text-gray-500"
                                  fill="none"
                                  stroke="currentColor"
                                  viewBox="0 0 24 24"
                                >
                                  <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                  />
                                </svg>
                              </div>
                            )}
                          </div>

                          {/* Details */}
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                              {management.user?.name}
                            </h3>
                            <p className="text-sm text-blue-600 font-medium">
                              {getPositionLabel(management.position)}
                            </p>
                            <p className="text-sm text-gray-500 truncate">
                              {management.user?.email}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              Periode: {management.period?.name}
                            </p>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                          <Link
                            href={`/admin/governance/managements/edit/${management.id}`}
                            className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                          >
                            Edit
                          </Link>
                          {management.photo && (
                            <button
                              onClick={() => {
                                const fileId = extractFileId(
                                  management.photo || ""
                                );
                                if (fileId) {
                                  handledeleteFile(
                                    fileId,
                                    `${management.user?.name} - Photo`
                                  );
                                }
                              }}
                              disabled={isOperating}
                              className="px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded hover:bg-orange-100 border border-orange-200 disabled:opacity-50"
                            >
                              Hapus Foto
                            </button>
                          )}
                          <button
                            onClick={() => handleDelete(management)}
                            disabled={isOperating}
                            className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200 disabled:opacity-50"
                          >
                            Hapus
                          </button>
                        </div>
                      </div>
                    );
                  })}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              Tidak ada management
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {managements.length === 0
                ? "Mulai dengan menambahkan anggota management pertama."
                : "Tidak ada hasil yang cocok dengan filter yang dipilih."}
            </p>
            {managements.length === 0 && (
              <div className="mt-6">
                <Link
                  href="/admin/governance/managements/add"
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <svg
                    className="-ml-1 mr-2 h-5 w-5"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Tambah Management
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
      {/* Loading Overlay */}
      {isOperating && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-gray-700">Processing your request...</p>
          </div>
        </div>
      )}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        managementName={deleteModal.managementName || deleteModal.fileName}
        onClose={() =>
          setDeleteModal({
            isOpen: false,
            managementId: null,
            managementName: "",
            fileId: null,
            fileName: "",
          })
        }
        onConfirm={confirmDelete}
        isLoading={isOperating}
      />
    </div>
  );
};

export default ManagementTable;
