"use client";

import WorkStats from "@/components/admin/work/Stats";
import WorkFilters from "@/components/admin/work/Filters";
import WorkTable from "@/components/admin/work/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import StatusChip from "@/components/admin/ui/chip/Status";
import DepartmentChip from "@/components/admin/ui/chip/Department";
import StatusApprovalChip from "@/components/admin/ui/chip/StatusApproval";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import { useWorkManagement } from "@/hooks/work-program/useWorkManagement";
import ExportButtons from "@/components/admin/work/ExportButtons";

export default function WorkProgramPage() {
  const {
    workPrograms,
    allWorkPrograms,
    loading,
    error,
    success,
    selectedPrograms,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    showDeleteModal,
    showViewModal,
    currentProgram,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentProgram,
    toggleProgramSelection,
    toggleSelectAll,
    handleViewProgram,
    handleAddProgram,
    handleEditProgram,
    handleDelete,
    confirmDelete,
    handleFilterChange,
  } = useWorkManagement();

  // Get unique periods for export
  const uniquePeriods = Array.from(
    new Set(
      allWorkPrograms.map((program) => program.period?.name).filter(Boolean)
    )
  );

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
          title="Work Program Management"
          description="Manage all work programs and their details"
        />
        <div className="flex gap-2">
          <ExportButtons workPrograms={workPrograms} periods={uniquePeriods} />
          <AddButton onClick={handleAddProgram} text="Add Program" />
        </div>
      </div>
      <WorkStats workPrograms={workPrograms} />
      {alert && <Alert type={alert.type} message={alert.message} />}
      <WorkFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedPrograms={selectedPrograms}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />
      <WorkTable
        workPrograms={workPrograms}
        selectedPrograms={selectedPrograms}
        currentPage={currentPage}
        totalPages={totalPages}
        onProgramSelect={toggleProgramSelection}
        onSelectAll={toggleSelectAll}
        onViewProgram={handleViewProgram}
        onEditProgram={handleEditProgram}
        onDeleteProgram={(ids) =>
          handleDelete(ids ? undefined : currentProgram || undefined)
        }
        onPageChange={setCurrentPage}
        onAddProgram={handleAddProgram}
      />
      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentProgram?.name}
        selectedCount={selectedPrograms.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentProgram(null);
        }}
        onConfirm={confirmDelete}
      />
      <ViewModal
        isOpen={showViewModal}
        title="Work Program Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentProgram(null);
        }}
      >
        {currentProgram && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentProgram.name}
                </h4>
                <p className="text-gray-600">{currentProgram.goal}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  <DepartmentChip department={currentProgram.department} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentProgram.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval
                </label>
                <div className="mt-1">
                  {currentProgram.approvals &&
                  currentProgram.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = currentProgram.approvals.sort(
                        (a, b) =>
                          new Date(b.updatedAt).getTime() -
                          new Date(a.updatedAt).getTime()
                      )[0];
                      return (
                        <StatusApprovalChip status={latestApproval.status} />
                      );
                    })()
                  ) : (
                    <span className="text-xs text-gray-400">No approvals</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Schedule
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentProgram.schedule}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Funds
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(currentProgram.funds)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Used Funds
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(currentProgram.usedFunds)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Remaining Funds
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  }).format(currentProgram.remainingFunds)}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Responsible
                </label>
                <div className="mt-1 flex items-center space-x-2">
                  <span className="text-sm text-gray-900">
                    {currentProgram.responsible?.name || "Unassigned"}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Period
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentProgram.period?.name || "No period"}
                </p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Goals
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer html={currentProgram.goal} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentProgram.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentProgram.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
