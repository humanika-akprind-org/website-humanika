import {
  FiFileText,
  FiEdit,
  FiTrash,
  FiEye,
  FiDownload,
  FiClipboard,
  FiTarget,
} from "react-icons/fi";
import type { Document } from "@/types/document";

import Checkbox from "../../ui/checkbox/Checkbox";
import StatusChip from "../../ui/chip/Status";
import StatusApproval from "../../ui/chip/StatusApproval";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import { useRef, useState } from "react";
import { getGoogleDriveDirectUrl } from "@/lib/google-drive/file-utils";

interface DocumentTableProps {
  documents: Document[];
  selectedDocuments: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onDocumentSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewDocument: (document: Document) => void;
  onEditDocument: (id: string) => void;
  onDeleteDocument: (document?: Document) => void;
  onPageChange: (page: number) => void;
  onAddDocument: () => void;
  typeFilter?: string;
}

export default function DocumentTable({
  documents,
  selectedDocuments,
  loading,
  currentPage,
  totalPages,
  onDocumentSelect,
  onSelectAll,
  onViewDocument,
  onEditDocument,
  onDeleteDocument,
  onPageChange,
  onAddDocument,
  typeFilter,
}: DocumentTableProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter documents by type if typeFilter is provided
  const filteredDocuments = typeFilter
    ? documents.filter(
        (doc) =>
          doc.documentType?.name?.toLowerCase().replace(/[\s\-]/g, "") ===
          typeFilter.toLowerCase().replace(/[\s\-]/g, "")
      )
    : documents;

  // Sort documents
  const sortedDocuments = [...filteredDocuments].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "type":
        aValue = a.documentType?.name?.toLowerCase() || "";
        bValue = b.documentType?.name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;

      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleDocumentSelect = (id: string) => {
    onDocumentSelect(id);
  };

  const handleEditDocument = (id: string) => {
    onEditDocument(id);
  };

  const handleAddDocument = () => {
    onAddDocument();
  };

  // Handle download document
  const handleDownloadDocument = (document: Document) => {
    if (document.document) {
      const downloadUrl = getGoogleDriveDirectUrl(
        document.document,
        "download"
      );
      if (downloadUrl) {
        window.open(downloadUrl, "_blank");
      }
    }
  };

  // Determine empty state props based on typeFilter
  const emptyStateProps = (() => {
    if (typeFilter === "proposal") {
      return {
        icon: <FiClipboard size={48} className="mx-auto" />,
        title: "No proposals found",
        description: "Try adjusting your search or filter criteria",
        actionButton: (
          <AddButton onClick={handleAddDocument} text="Add Proposal" />
        ),
      };
    } else if (typeFilter === "accountabilityreport") {
      return {
        icon: <FiTarget size={48} className="mx-auto" />,
        title: "No accountability reports found",
        description: "Try adjusting your search or filter criteria",
        actionButton: (
          <AddButton onClick={handleAddDocument} text="Add Accountability" />
        ),
      };
    } else {
      return {
        icon: <FiFileText size={48} className="mx-auto" />,
        title: "No documents found",
        description: "Try adjusting your search or filter criteria",
        actionButton: (
          <AddButton onClick={handleAddDocument} text="Add Document" />
        ),
      };
    }
  })();

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
              >
                <Checkbox
                  checked={
                    sortedDocuments.length > 0 &&
                    selectedDocuments.length === sortedDocuments.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Document Name
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="name"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("type")}
              >
                <div className="flex items-center">
                  Type
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="type"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Approval
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedDocuments.map((document, index) => (
              <tr
                key={document.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedDocuments.includes(document.id)}
                    onChange={() => handleDocumentSelect(document.id)}
                  />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${document.document}/view`,
                      "_blank"
                    );
                  }}
                >
                  {document.name}
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap text-sm text-gray-600"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${document.document}/view`,
                      "_blank"
                    );
                  }}
                >
                  {document.documentType?.name
                    .replace(/_/g, " ")
                    .toLowerCase()
                    .replace(/\b\w/g, (l) => l.toUpperCase())}
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${document.document}/view`,
                      "_blank"
                    );
                  }}
                >
                  <StatusChip status={document.status} />
                </td>
                <td
                  className="px-4 py-4 whitespace-nowrap"
                  onClick={() => {
                    window.open(
                      `https://drive.google.com/file/d/${document.document}/view`,
                      "_blank"
                    );
                  }}
                >
                  <StatusApproval
                    status={
                      document.approvals && document.approvals.length > 0
                        ? document.approvals.sort(
                            (a, b) =>
                              new Date(b.updatedAt).getTime() -
                              new Date(a.updatedAt).getTime()
                          )[0].status
                        : "PENDING"
                    }
                  />
                </td>

                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedDocuments.length - 1}
                    hasMultipleItems={sortedDocuments.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewDocument(document)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditDocument(document.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleDownloadDocument(document)}
                      color="default"
                    >
                      <FiDownload className="mr-2" size={14} />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteDocument(document)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedDocuments.length === 0 && !loading && (
        <EmptyState
          icon={emptyStateProps.icon}
          title={emptyStateProps.title}
          description={emptyStateProps.description}
          actionButton={emptyStateProps.actionButton}
        />
      )}

      {sortedDocuments.length > 0 && (
        <Pagination
          usersLength={sortedDocuments.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
