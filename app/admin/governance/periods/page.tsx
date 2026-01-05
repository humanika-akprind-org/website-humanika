"use client";

import PeriodStats from "@/components/admin/pages/period/Stats";
import PeriodFilters from "@/components/admin/pages/period/Filters";
import PeriodTable from "@/components/admin/pages/period/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import ActiveChip from "@/components/admin/ui/chip/Active";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import { usePeriodManagement } from "@/hooks/period/usePeriodManagement";

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
        <AddButton onClick={handleAddPeriod} text="Add Period" />
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
      />

      <PeriodTable
        periods={filteredPeriods}
        selectedPeriods={selectedPeriods}
        onSelectPeriod={togglePeriodSelection}
        onSelectAll={toggleSelectAll}
        onViewPeriod={handleViewPeriod}
        onEditPeriod={handleEditPeriod}
        onDelete={handleDelete}
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
