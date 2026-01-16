"use client";

import { useState } from "react";
import Stats from "@/components/admin/pages/finance/Stats";
import Filters from "@/components/admin/pages/finance/Filters";
import FinanceTable from "@/components/admin/pages/finance/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import HtmlRenderer from "@/components/admin/ui/HtmlRenderer";
import StatusChip from "@/components/admin/ui/chip/Status";
import StatusApprovalChip from "@/components/admin/ui/chip/StatusApproval";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
import ImageView from "@/components/admin/ui/avatar/ImageView";
import { useFinanceManagement } from "@/hooks/finance/useFinanceManagement";

export default function FinanceTransactionsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [workProgramFilter, setWorkProgramFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [periodFilter, setPeriodFilter] = useState("all");

  const {
    finances,
    loading,
    error,
    success,
    selectedFinances,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentFinance,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentFinance,
    toggleFinanceSelection,
    toggleSelectAll,
    handleAddFinance,
    handleEditFinance,
    handleViewFinance,
    handleDelete,
    confirmDelete,
  } = useFinanceManagement();

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
          title="Finance Transactions"
          description="Manage and organize your financial transactions"
        />
        <AddButton onClick={handleAddFinance} text="Add Transaction" />
      </div>

      <Stats finances={finances} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
        typeFilter={typeFilter}
        onTypeFilterChange={setTypeFilter}
        categoryFilter={categoryFilter}
        onCategoryFilterChange={setCategoryFilter}
        workProgramFilter={workProgramFilter}
        onWorkProgramFilterChange={setWorkProgramFilter}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        selectedCount={selectedFinances.length}
        onDeleteSelected={() => handleDelete()}
      />

      <FinanceTable
        finances={finances}
        selectedFinances={selectedFinances}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onFinanceSelect={toggleFinanceSelection}
        onSelectAll={toggleSelectAll}
        onViewFinance={handleViewFinance}
        onEditFinance={handleEditFinance}
        onDeleteFinance={handleDelete}
        onPageChange={setCurrentPage}
        onAddFinance={handleAddFinance}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentFinance?.name}
        selectedCount={selectedFinances.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentFinance(null);
        }}
        onConfirm={confirmDelete}
        requireGoogleDriveAuth={true}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Transaction Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentFinance(null);
        }}
      >
        {currentFinance && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentFinance.name}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Amount
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  Rp {currentFinance.amount.toLocaleString("id-ID")}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="mt-1">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      currentFinance.type === "INCOME"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {currentFinance.type}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentFinance.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Category
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentFinance.category?.name || "No category"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Work Program
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentFinance.workProgram?.name || "No work program"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(currentFinance.date))}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval
                </label>
                <div className="mt-1">
                  {currentFinance.approvals &&
                  currentFinance.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = currentFinance.approvals.sort(
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

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer
                    html={currentFinance.description || "No description"}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentFinance.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentFinance.updatedAt} />
                </p>
              </div>
            </div>

            {currentFinance.proof && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Proof
                </label>
                <div className="mt-2">
                  <ImageView
                    imageUrl={currentFinance.proof}
                    alt={`Proof for ${currentFinance.name}`}
                    size={{ width: 300, height: 200 }}
                    modalTitle={`Proof - ${currentFinance.name}`}
                  />
                </div>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </div>
  );
}
