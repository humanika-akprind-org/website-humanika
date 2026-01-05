"use client";

import LetterStats from "@/components/admin/pages/letter/Stats";
import LetterFilters from "@/components/admin/pages/letter/Filters";
import LetterTable from "@/components/admin/pages/letter/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import HtmlRenderer from "components/admin/ui/HtmlRenderer";
import TypeChip from "components/admin/ui/chip/Type";
import PriorityChip from "components/admin/ui/chip/Priority";
import StatusChip from "components/admin/ui/chip/Status";
import StatusApprovalChip from "components/admin/ui/chip/StatusApproval";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import { useLetterManagement } from "@/hooks/letter/useLetterManagement";
import type { LetterFilter } from "@/types/letter";

export default function LettersPage() {
  const {
    letters,
    loading,
    error,
    success,
    selectedLetters,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentLetter,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentLetter,
    setTypeFilter,
    setPriorityFilter,
    toggleLetterSelection,
    toggleSelectAll,
    handleAddLetter,
    handleEditLetter,
    handleViewLetter,
    handleDelete,
    confirmDelete,
  } = useLetterManagement();

  const alert: { type: AlertType; message: string } | null = error
    ? { type: "error", message: error }
    : success
    ? { type: "success", message: success }
    : null;

  const handleFilterChange = (filter: LetterFilter) => {
    if (filter.type !== undefined) setTypeFilter(filter.type || "all");
    if (filter.priority !== undefined) {
      setPriorityFilter(filter.priority || "all");
    }
    if (filter.search !== undefined) setSearchTerm(filter.search || "");
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Letters Management"
          description="Manage and organize your letters"
        />
        <AddButton onClick={handleAddLetter} text="Add Letter" />
      </div>

      <LetterStats letters={letters} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <LetterFilters onFilter={handleFilterChange} isLoading={loading} />

      <LetterTable
        letters={letters}
        selectedLetters={selectedLetters}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onLetterSelect={toggleLetterSelection}
        onSelectAll={toggleSelectAll}
        onViewLetter={handleViewLetter}
        onEditLetter={handleEditLetter}
        onDeleteLetter={handleDelete}
        onPageChange={setCurrentPage}
        onAddLetter={handleAddLetter}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentLetter?.regarding}
        selectedCount={selectedLetters.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentLetter(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Letter Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentLetter(null);
        }}
      >
        {currentLetter && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentLetter.regarding}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <div className="mt-1">
                  <TypeChip type={currentLetter.type} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <div className="mt-1">
                  <PriorityChip priority={currentLetter.priority} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentLetter.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Origin
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentLetter.origin}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Destination
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentLetter.destination}
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
                  }).format(new Date(currentLetter.date))}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval
                </label>
                <div className="mt-1">
                  {currentLetter.approvals &&
                  currentLetter.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = currentLetter.approvals.sort(
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
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentLetter.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentLetter.updatedAt} />
                </p>
              </div>
            </div>

            {currentLetter.body && (
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700">
                  Body
                </label>
                <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
                  <HtmlRenderer html={currentLetter.body || "No body"} />
                </div>
              </div>
            )}

            {currentLetter.letter && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Letter File
                </label>
                <div className="mt-2">
                  <a
                    href={currentLetter.letter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Letter File
                  </a>
                </div>
              </div>
            )}
          </div>
        )}
      </ViewModal>
    </div>
  );
}
