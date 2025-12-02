"use client";

import React from "react";
import Link from "next/link";
import type { Management } from "@/types/management";
import { type Department, Position } from "@/types/enums";
import DeleteModal from "./modal/DeleteModal";
import PeriodFilters from "./Filters";
import ManagementStats from "./Stats";
import ManagementCard from "./ManagementCard";
import { useManagementTable } from "@/hooks/management/useManagementTable";

interface ManagementTableProps {
  managements: Management[];
  accessToken: string;
}

const ManagementTable: React.FC<ManagementTableProps> = ({
  managements,
  accessToken,
}) => {
  const {
    // States
    searchTerm,
    setSearchTerm,
    statusFilter,
    setStatusFilter,
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
  } = useManagementTable(managements, accessToken);

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
                  .map((management) => (
                    <ManagementCard
                      key={management.id}
                      management={management}
                      isSelected={selectedManagements.includes(management.id)}
                      onSelect={(id) => {
                        if (selectedManagements.includes(id)) {
                          setSelectedManagements(
                            selectedManagements.filter(
                              (selectedId) => selectedId !== id
                            )
                          );
                        } else {
                          setSelectedManagements([...selectedManagements, id]);
                        }
                      }}
                      proxyImageUrl={getProxyImageUrl(management.photo || "")}
                      hasImageError={hasImageError(
                        getProxyImageUrl(management.photo || "")
                      )}
                      onImageError={handleImageError}
                      onDelete={handleDelete}
                      onDeleteFile={handledeleteFile}
                      isOperating={isOperating}
                      getPositionLabel={getPositionLabel}
                      extractFileId={extractFileId}
                    />
                  ))}
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
      <DeleteModal
        isOpen={bulkDeleteModal.isOpen}
        managementName={`${bulkDeleteModal.selectedIds.length} selected managements`}
        onClose={() => setBulkDeleteModal({ isOpen: false, selectedIds: [] })}
        onConfirm={confirmBulkDelete}
        isLoading={isOperating}
      />
    </div>
  );
};

export default ManagementTable;
