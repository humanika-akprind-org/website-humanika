"use client";

import { useWorkProgramApproval } from "@/hooks/work-program/useWorkProgramApproval";
import ApprovalFilters from "@/components/admin/approval/Filters";
import ApprovalTable from "@/components/admin/approval/Table";
import ApprovalActionModal from "@/components/admin/approval/ActionModal";
import Alert from "@/components/admin/ui/alert/Alert";
import LoadingApproval from "@/components/admin/layout/loading/LoadingApproval";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";

export default function WorkProgramApprovalPage() {
  const {
    approvals,
    loading,
    alert,
    searchTerm,
    setSearchTerm,
    filters,
    currentPage,
    totalPages,
    selectedApprovals,
    selectedApprovalData,
    actionModal,
    handleFilterChange,
    handleApprovalSelect,
    handleSelectAll,
    handlePageChange,
    handleApprove,
    handleReject,
    handleRequestRevision,
    handleReturn,
    handleBulkApprove,
    handleBulkReject,
    handleBulkRequestRevision,
    handleBulkReturn,
    handleBulkActionConfirm,
    closeActionModal,
  } = useWorkProgramApproval();

  if (loading) {
    return <LoadingApproval />;
  }

  return (
    <div>
      <ManagementHeader
        title="Work Program Approvals"
        description="Manage all work program approval requests"
      />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {/* Filters and Search */}
      <ApprovalFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedApprovals={selectedApprovals}
        selectedApprovalData={selectedApprovalData}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onBulkApprove={handleBulkApprove}
        onBulkReject={handleBulkReject}
        onBulkRequestRevision={handleBulkRequestRevision}
        onBulkReturn={handleBulkReturn}
      />

      {/* Approvals Table */}
      <ApprovalTable
        approvals={approvals}
        selectedApprovals={selectedApprovals}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onApprovalSelect={handleApprovalSelect}
        onSelectAll={handleSelectAll}
        onApproveApproval={handleApprove}
        onRejectApproval={handleReject}
        onRequestRevision={handleRequestRevision}
        onReturnApproval={handleReturn}
        onPageChange={handlePageChange}
      />

      <ApprovalActionModal
        isOpen={actionModal.isOpen}
        title={actionModal.title}
        onClose={closeActionModal}
        onConfirm={handleBulkActionConfirm}
      />
    </div>
  );
}
