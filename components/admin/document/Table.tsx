import { useState } from "react";
import Link from "next/link";
import {
  FiFileText,
  FiUser,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import type { Document } from "@/types/document";
import type { Status } from "@/types/enums";
import { Status as StatusEnum, DocumentType } from "@/types/enums";

import DocumentStats from "./Stats";
import DocumentFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface DocumentTableProps {
  documents: Document[];
  onDelete: (id: string, name: string) => void;
  accessToken?: string;
}

export default function DocumentTable({
  documents,
  onDelete,
}: DocumentTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [typeFilter, setTypeFilter] = useState<DocumentType | "all">("all");
  const [userFilter, setUserFilter] = useState<string>("all");
  const [selectedDocuments, setSelectedDocuments] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState<Document | null>(
    null
  );
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as unknown as StatusEnum)) &&
    setStatusFilter(status === "all" ? "all" : (status as unknown as Status));

  const handleTypeFilterChange = (type: string) =>
    (type === "all" ||
      Object.values(DocumentType).includes(type as unknown as DocumentType)) &&
    setTypeFilter(type === "all" ? "all" : (type as unknown as DocumentType));

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.PUBLISH:
        return "bg-green-100 text-green-800";
      case StatusEnum.PRIVATE:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.ARCHIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (document: Document) => {
    setDocumentToDelete(document);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedDocuments.forEach((id) => {
        const doc = documents.find((d) => d.id === id);
        if (doc) onDelete(id, doc.name);
      });
      setSelectedDocuments([]);
    } else if (documentToDelete) {
      onDelete(documentToDelete.id, documentToDelete.name);
    }
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDocumentToDelete(null);
    setIsBulkDelete(false);
  };

  // Filter documents based on search term and filters
  const filteredDocuments = documents.filter((document) => {
    const matchesSearch = document.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || document.status === statusFilter;

    const matchesType = typeFilter === "all" || document.type === typeFilter;

    const matchesUser = userFilter === "all" || document.user.id === userFilter;

    return matchesSearch && matchesStatus && matchesType && matchesUser;
  });

  // Toggle document selection
  const toggleDocumentSelection = (id: string) => {
    setSelectedDocuments((prev) =>
      prev.includes(id)
        ? prev.filter((documentId) => documentId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedDocuments.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (documents.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiFileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No documents found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first document.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <DocumentStats documents={filteredDocuments} />

      <DocumentFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter.toString()}
        onStatusFilterChange={handleStatusFilterChange}
        typeFilter={typeFilter.toString()}
        onTypeFilterChange={handleTypeFilterChange}
        userFilter={userFilter}
        onUserFilterChange={setUserFilter}
        selectedCount={selectedDocuments.length}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredDocuments.length} of {documents.length} documents
          </p>
        </div>

        {selectedDocuments.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedDocuments.length} document
              {selectedDocuments.length > 1 ? "s" : ""} selected
            </span>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredDocuments.length > 0 &&
                      selectedDocuments.length === filteredDocuments.length
                    }
                    onChange={() => {
                      if (
                        selectedDocuments.length === filteredDocuments.length
                      ) {
                        setSelectedDocuments([]);
                      } else {
                        setSelectedDocuments(
                          filteredDocuments.map((document) => document.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Document
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Type
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Approval
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  User
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Created At
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.length > 0 ? (
                filteredDocuments.map((document) => (
                  <tr
                    key={document.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedDocuments.includes(document.id)}
                        onChange={() => toggleDocumentSelection(document.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {document.name}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {document.type
                        .replace(/_/g, " ")
                        .toLowerCase()
                        .replace(/\b\w/g, (l) => l.toUpperCase())}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          document.status
                        )}`}
                      >
                        {document.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {document.approvals && document.approvals.length > 0 ? (
                        (() => {
                          const latestApproval = document.approvals.sort(
                            (a, b) =>
                              new Date(b.updatedAt).getTime() -
                              new Date(a.updatedAt).getTime()
                          )[0];
                          return (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
                                latestApproval.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : latestApproval.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {latestApproval.status === "APPROVED" && (
                                <FiCheckCircle className="mr-1" />
                              )}
                              {latestApproval.status === "REJECTED" && (
                                <FiXCircle className="mr-1" />
                              )}
                              {latestApproval.status === "PENDING" && (
                                <FiClock className="mr-1" />
                              )}
                              {latestApproval.status}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-xs text-gray-400">
                          No approvals
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" size={14} />
                        {document.user?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(document.createdAt)}
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/administration/documents/edit/${document.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit document"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(document)}
                          title="Delete document"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="px-6 py-12 text-center">
                    <FiFileText className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No documents found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {documents.length === 0
                        ? "Get started by creating your first document."
                        : "No documents match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredDocuments.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredDocuments.length}</span> of{" "}
              <span className="font-medium">{documents.length}</span> documents
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        documentName={documentToDelete?.name || ""}
        count={isBulkDelete ? selectedDocuments.length : 1}
        isLoading={false}
      />
    </div>
  );
}
