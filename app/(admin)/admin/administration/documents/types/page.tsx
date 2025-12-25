"use client";

import DocumentTypeStats from "@/components/admin/document/type/Stats";
import DocumentTypeFilters from "@/components/admin/document/type/Filters";
import DocumentTypeTable from "@/components/admin/document/type/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import { useDocumentTypeManagement } from "@/hooks/document-type/useDocumentTypeManagement";

export default function DocumentTypesPage() {
  const {
    types,
    loading,
    error,
    success,
    selectedTypes,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentType,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentType,
    toggleTypeSelection,
    toggleSelectAll,
    handleAddType,
    handleEditType,
    handleViewType,
    handleDelete,
    confirmDelete,
  } = useDocumentTypeManagement();

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
          title="Document Types"
          description="Manage document types and their details"
        />
        <AddButton onClick={handleAddType} text="Add Type" />
      </div>

      <DocumentTypeStats types={types} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <DocumentTypeFilters
        searchTerm={searchTerm}
        selectedCategories={selectedTypes}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />

      <DocumentTypeTable
        types={types}
        selectedTypes={selectedTypes}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onTypeSelect={toggleTypeSelection}
        onSelectAll={toggleSelectAll}
        onViewType={handleViewType}
        onEditType={handleEditType}
        onDeleteType={handleDelete}
        onPageChange={setCurrentPage}
        onAddType={handleAddType}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentType?.name}
        selectedCount={selectedTypes.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentType(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Document Type Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentType(null);
        }}
      >
        {currentType && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{currentType.name}</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentType.description || "No description"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Created At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(currentType.createdAt))}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Updated At
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {new Intl.DateTimeFormat("id-ID", {
                  day: "2-digit",
                  month: "2-digit",
                  year: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }).format(new Date(currentType.updatedAt))}
              </p>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
