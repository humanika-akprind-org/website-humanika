"use client";

import PeriodStats from "@/src/presentation/components/admin/pages/period/Stats";
import PeriodFilters from "@/src/presentation/components/admin/pages/period/Filters";
import PeriodTable from "@/src/presentation/components/admin/pages/period/Table";
import DeleteModal from "@/src/presentation/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/src/presentation/components/admin/ui/modal/ViewModal";
import Loading from "@/src/presentation/components/admin/layout/loading/Loading";
import Alert, {
  type AlertType,
} from "@/src/presentation/components/admin/ui/alert/Alert";
import ManagementHeader from "@/src/presentation/components/admin/ui/ManagementHeader";
import AddButton from "@/src/presentation/components/admin/ui/button/AddButton";
import ActiveChip from "@/src/presentation/components/admin/ui/chip/Active";
import DateDisplay from "@/src/presentation/components/admin/ui/date/DateDisplay";
import { usePeriodManagement } from "@/src/presentation/hooks/period/usePeriodManagement";
import { useResourcePermission } from "@/src/presentation/hooks/usePermission";

export default function PeriodsPage() {
  const {
    periods,
    filteredPeriods,
    loading,
    error,
    success,
    selectedPeriods,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentPeriod,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentPeriod,
    togglePeriodSelection,
    toggleSelectAll,
    handleViewPeriod,
    handleAddPeriod,
    handleEditPeriod,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  } = usePeriodManagement();

  const { canAdd, canDelete } = useResourcePermission("periods");

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
          title="Period Management"
          description="Manage all organization periods"
        />
        {canAdd() && <AddButton onClick={handleAddPeriod} text="Add Period" />}
      </div>

      <PeriodStats periods={periods} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <PeriodFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={filters.status}
        onStatusFilterChange={(status) => handleFilterChange({ status })}
        selectedCount={selectedPeriods.length}
        onDeleteSelected={() => handleDelete()}
        canDelete={canDelete}
      />

      <PeriodTable
        periods={filteredPeriods}
        selectedPeriods={selectedPeriods}
        onSelectPeriod={togglePeriodSelection}
        onSelectAll={toggleSelectAll}
        onViewPeriod={handleViewPeriod}
        onEditPeriod={handleEditPeriod}
        onDelete={handleDelete}
        onAddPeriod={handleAddPeriod}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentPeriod?.name}
        selectedCount={selectedPeriods.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentPeriod(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Period Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentPeriod(null);
        }}
      >
        {currentPeriod && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <p className="mt-1 text-sm text-gray-900">{currentPeriod.name}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Start Year
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentPeriod.startYear}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  End Year
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentPeriod.endYear}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <ActiveChip isActive={currentPeriod.isActive} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentPeriod.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentPeriod.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
