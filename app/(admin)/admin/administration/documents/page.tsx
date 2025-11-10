"use client";

import Link from "next/link";
import { FiPlus } from "react-icons/fi";
import DocumentTable from "@/components/admin/document/Table";
import DeleteModal from "@/components/admin/document/modal/DeleteModal";
import { useDocuments } from "@/hooks/document/useDocuments";

export default function DocumentsPage() {
  const {
    filteredDocuments,
    isLoading,
    deleteModal,
    handleDelete,
    closeDeleteModal,
    openDeleteModal,
  } = useDocuments();

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Documents Management
          </h1>
          <p className="text-gray-600">Manage and organize your documents</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/admin/administration/documents/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Document
          </Link>
        </div>
      </div>

      {/* Documents Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <DocumentTable
          documents={filteredDocuments}
          onDelete={(id, name) => openDeleteModal(id, name)}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.documentId)}
        documentName={deleteModal.documentName}
        count={1}
        isLoading={false}
      />
    </div>
  );
}
