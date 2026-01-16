"use client";

import StructureStats from "@/components/admin/pages/structure/Stats";
import StructureFilters from "@/components/admin/pages/structure/Filters";
import StructureTable from "@/components/admin/pages/structure/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import { useStructureManagement } from "@/hooks/structure/useStructureManagement";
import { useResourcePermission } from "@/hooks/usePermission";
import ImageView from "@/components/admin/ui/avatar/ImageView";

export default function StructuresPage() {
  const {
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
  } = useStructureManagement();

  const { canAdd, canDelete } = useResourcePermission("structure");

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
          title="Organizational Structures Management"
          description="Manage and organize your organizational structures"
        />
        {canAdd() && (
          <AddButton onClick={handleAddStructure} text="Add Structure" />
        )}
      </div>

      <StructureStats structures={structures} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <StructureFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedCount={selectedStructures.length}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
        canDelete={canDelete}
      />

      <StructureTable
        structures={structures}
        selectedStructures={selectedStructures}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onStructureSelect={toggleStructureSelection}
        onSelectAll={toggleSelectAll}
        onViewStructure={handleViewStructure}
        onEditStructure={handleEditStructure}
        onDeleteStructure={handleDelete}
        onPageChange={setCurrentPage}
        onAddStructure={handleAddStructure}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentStructure?.name}
        selectedCount={selectedStructures.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentStructure(null);
        }}
        onConfirm={confirmDelete}
        requireGoogleDriveAuth={true}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Structure Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentStructure(null);
        }}
      >
        {currentStructure && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentStructure.name}
                </h4>
                <p className="text-gray-600">
                  {currentStructure.status} - {currentStructure.period?.name}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Name
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStructure.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStructure.status}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStructure.period?.name}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Decree
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentStructure.decree ? (
                    <a
                      href={
                        currentStructure.decree.startsWith("http")
                          ? currentStructure.decree
                          : `https://drive.google.com/file/d/${currentStructure.decree}/view`
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:text-blue-800 underline"
                    >
                      {`Decree - ${currentStructure.name}`}
                    </a>
                  ) : (
                    "No decree"
                  )}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentStructure.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentStructure.updatedAt} />
                </p>
              </div>
            </div>

            <div className="mt-6">
              <ImageView
                imageUrl={currentStructure.structure}
                alt={`Structure diagram for ${currentStructure.name}`}
                size={{ width: 400, height: 300 }}
                modalTitle={`Structure Diagram - ${currentStructure.name}`}
              />
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
