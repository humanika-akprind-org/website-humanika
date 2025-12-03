"use client";

import { useState, useEffect } from "react";
import ManagementStats from "@/components/admin/management/Stats";
import ManagementFilters from "@/components/admin/management/Filters";
import ManagementTable from "@/components/admin/management/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import ManagementAvatar from "@/components/admin/ui/avatar/ManagementAvatar";
import DepartmentChip from "@/components/admin/ui/chip/Department";
import PositionChip from "@/components/admin/ui/chip/Position";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import { useManagementManagement } from "@/hooks/management/useManagementManagement";
import { getAccessTokenAction } from "@/lib/actions/accessToken";

export default function ManagementsPage() {
  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessTokenAction();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  const {
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
  } = useManagementManagement();

  const alert: { type: AlertType; message: string } | null = error
    ? { type: "error", message: error }
    : success
    ? { type: "success", message: success }
    : null;

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Management Structure"
          description="Manage all management members and their positions"
        />
        <AddButton onClick={handleAddManagement} text="Add Management" />
      </div>

      <ManagementStats managements={managements} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <ManagementFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedManagements={selectedManagements}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />

      <ManagementTable
        managements={managements}
        selectedManagements={selectedManagements}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        accessToken={accessToken}
        onManagementSelect={toggleManagementSelection}
        onSelectAll={toggleSelectAll}
        onViewManagement={handleViewManagement}
        onEditManagement={handleEditManagement}
        onDeleteManagement={handleDelete}
        onPageChange={setCurrentPage}
        onAddManagement={handleAddManagement}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentManagement?.user?.name}
        selectedCount={selectedManagements.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentManagement(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Management Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentManagement(null);
        }}
      >
        {currentManagement && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <ManagementAvatar
                management={currentManagement}
                accessToken={accessToken}
              />
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentManagement.user?.name}
                </h4>
                <p className="text-gray-600">
                  {currentManagement.position} - {currentManagement.department}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentManagement.user?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentManagement.user?.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  <DepartmentChip department={currentManagement.department} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <div className="mt-1">
                  <PositionChip position={currentManagement.position} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentManagement.period?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentManagement.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentManagement.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
