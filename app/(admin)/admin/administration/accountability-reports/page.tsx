"use client";

import { useState } from "react";
import DocumentStats from "@/components/admin/document/Stats";
import DocumentFilters from "@/components/admin/document/Filters";
import DocumentTable from "@/components/admin/document/Table";
import DeleteModal from "components/admin/ui/modal/DeleteModal";
import ViewModal from "components/admin/ui/modal/ViewModal";
import Loading from "components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "components/admin/ui/alert/Alert";
import ManagementHeader from "components/admin/ui/ManagementHeader";
import AddButton from "components/admin/ui/button/AddButton";
import StatusChip from "components/admin/ui/chip/Status";
import StatusApprovalChip from "components/admin/ui/chip/StatusApproval";
import DateDisplay from "components/admin/ui/date/DateDisplay";
import { useDocumentManagement } from "@/hooks/document/useDocumentManagement";

export default function AccountabilityReportsPage() {
  const [statusFilter, setStatusFilter] = useState("all");
  const [typeFilter, setTypeFilter] = useState("all");
  const [userFilter, setUserFilter] = useState("all");

  const {
    documents,
    loading,
    error,
    success,
    selectedDocuments,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentDocument,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentDocument,
    setStatusFilter: setStatusFilterHook,
    setTypeFilter: setTypeFilterHook,
    setUserFilter: setUserFilterHook,
    toggleDocumentSelection,
    toggleSelectAll,
    handleAddDocument,
    handleEditDocument,
    handleViewDocument,
    handleDelete,
    confirmDelete,
  } = useDocumentManagement({
    addPath: "/admin/administration/accountability-reports/add",
    editPath: "/admin/administration/accountability-reports/edit",
  });

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
          title="Accountability Reports Management"
          description="Manage and organize your accountability reports"
        />
        <AddButton onClick={handleAddDocument} text="Add Accountability" />
      </div>

      <DocumentStats documents={documents} typeFilter="accountabilityreport" />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <DocumentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={(value) => {
          setStatusFilter(value);
          setStatusFilterHook(value);
        }}
        typeFilter={typeFilter}
        onTypeFilterChange={(value) => {
          setTypeFilter(value);
          setTypeFilterHook(value);
        }}
        userFilter={userFilter}
        onUserFilterChange={(value) => {
          setUserFilter(value);
          setUserFilterHook(value);
        }}
        selectedCount={selectedDocuments.length}
        onDeleteSelected={() => handleDelete()}
        showTypeFilter={false}
      />

      <DocumentTable
        documents={documents}
        selectedDocuments={selectedDocuments}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onDocumentSelect={toggleDocumentSelection}
        onSelectAll={toggleSelectAll}
        onViewDocument={handleViewDocument}
        onEditDocument={handleEditDocument}
        onDeleteDocument={handleDelete}
        onPageChange={setCurrentPage}
        onAddDocument={handleAddDocument}
        typeFilter="accountabilityreport"
      />

      <DeleteModal
        isOpen={showDeleteModal}
        itemName={currentDocument?.name}
        selectedCount={selectedDocuments.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentDocument(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="Document Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentDocument(null);
        }}
      >
        {currentDocument && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentDocument.name}
                </h4>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Type
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentDocument.documentType?.name || "No type"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <StatusChip status={currentDocument.status} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  User
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentDocument.user?.name || "No user"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Version
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentDocument.version}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Approval
                </label>
                <div className="mt-1">
                  {currentDocument.approvals &&
                  currentDocument.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = currentDocument.approvals.sort(
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
                  <DateDisplay date={currentDocument.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentDocument.updatedAt} />
                </p>
              </div>
            </div>

            {currentDocument.document && (
              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700">
                  Document
                </label>
                <div className="mt-2">
                  <a
                    href={currentDocument.document}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 underline"
                  >
                    View Document
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
