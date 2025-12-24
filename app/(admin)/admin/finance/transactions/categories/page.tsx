"use client";

import FinanceCategoryStats from "@/components/admin/finance/category/Stats";
import FinanceCategoryFilters from "@/components/admin/finance/category/Filters";
import FinanceCategoryTable from "@/components/admin/finance/category/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import { useFinanceCategoryManagement } from "@/hooks/finance-category/useFinanceCategoryManagement";

export default function FinanceCategoriesPage() {
  const {
    categories,
    loading,
    error,
    success,
    selectedCategories,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentCategory,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentCategory,
    toggleCategorySelection,
    toggleSelectAll,
    handleAddCategory,
    handleEditCategory,
    handleViewCategory,
    handleDelete,
    confirmDelete,
  } = useFinanceCategoryManagement();

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
          title="Finance Categories Management"
          description="Manage and organize your finance categories"
        />
        <AddButton onClick={handleAddCategory} text="Add Category" />
      </div>

      <FinanceCategoryStats categories={categories} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <FinanceCategoryFilters
        searchTerm={searchTerm}
        selectedCategories={selectedCategories}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />

      <FinanceCategoryTable
        categories={categories}
        selectedCategories={selectedCategories}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onCategorySelect={toggleCategorySelection}
        onSelectAll={toggleSelectAll}
        onViewCategory={handleViewCategory}
        onEditCategory={handleEditCategory}
        onDeleteCategory={handleDelete}
        onPageChange={setCurrentPage}
        onAddCategory={handleAddCategory}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentCategory?.name}
        selectedCount={selectedCategories.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentCategory(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Finance Category Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentCategory(null);
        }}
      >
        {currentCategory && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentCategory.name}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Description
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentCategory.description || "No description"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Type
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentCategory.type === "INCOME"
                  ? "Pemasukan"
                  : "Pengeluaran"}
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700">
                Status
              </label>
              <p className="mt-1 text-sm text-gray-900">
                {currentCategory.isActive ? "Active" : "Inactive"}
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
                }).format(new Date(currentCategory.createdAt))}
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
                }).format(new Date(currentCategory.updatedAt))}
              </p>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
