"use client";

import { useState, useRef } from "react";
import { FiCheck, FiX, FiClock, FiEye, FiRotateCcw } from "react-icons/fi";
import type { ApprovalWithRelations as Approval } from "@/types/approval";
import SortIcon from "../ui/SortIcon";
import StatusApproval from "../ui/chip/StatusApproval";
import Checkbox from "../ui/checkbox/Checkbox";
import Pagination from "../ui/pagination/Pagination";
import EmptyState from "../ui/EmptyState";
import DropdownMenuItem from "../ui/dropdown/DropdownMenuItem";
import DropdownMenu from "../ui/dropdown/DropdownMenu";
import ApprovalActionModal from "./ActionModal";
import ViewModal from "../ui/modal/ViewModal";
import HtmlRenderer from "../ui/HtmlRenderer";

interface ApprovalTableProps {
  approvals: Approval[];
  selectedApprovals: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onApprovalSelect: (id: string) => void;
  onSelectAll: () => void;
  onApproveApproval: (id: string, note?: string) => void;
  onRejectApproval: (id: string, note?: string) => void;
  onRequestRevision: (id: string, note?: string) => void;
  onReturnApproval: (id: string, note?: string) => void;
  onPageChange: (page: number) => void;
}

export default function ApprovalTable({
  approvals,
  selectedApprovals,
  currentPage,
  totalPages,
  onApprovalSelect,
  onSelectAll,
  onApproveApproval,
  onRejectApproval,
  onRequestRevision,
  onReturnApproval,
  onPageChange,
}: ApprovalTableProps) {
  const [sortField, setSortField] = useState("createdAt");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("desc");

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    onConfirm: (_note: string) => {},
  });

  const [viewModal, setViewModal] = useState({
    isOpen: false,
    title: "",
    content: null as React.ReactNode,
  });

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Helper function to format enum values for display
  const formatEnumValue = (value: string) =>
    value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

  // Helper function to get entity name
  const getEntityName = (approval: Approval) => {
    switch (approval.entityType) {
      case "WORK_PROGRAM":
        return approval.workProgram?.name || "Work Program";
      case "EVENT":
        return approval.event?.name || "Event";
      case "FINANCE":
        return approval.finance?.name || "Finance";
      case "DOCUMENT":
        return approval.document?.name || "Document";
      case "LETTER":
        return approval.letter?.regarding || "Letter";
      default:
        return formatEnumValue(approval.entityType);
    }
  };

  // Sort approvals
  const sortedApprovals = [...approvals].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "workProgram":
        aValue = getEntityName(a).toLowerCase();
        bValue = getEntityName(b).toLowerCase();
        break;
      case "requester":
        aValue = a.user?.name?.toLowerCase() || "";
        bValue = b.user?.name?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;
      default:
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
    }

    if (sortField === "createdAt") {
      return sortDirection === "asc"
        ? (aValue as number) - (bValue as number)
        : (bValue as number) - (aValue as number);
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

  // Handle action modal
  const handleActionModal = (
    title: string,
    onConfirm: (note: string) => void
  ) => {
    setActionModal({
      isOpen: true,
      title,
      onConfirm,
    });
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      title: "",
      onConfirm: (_note: string) => {},
    });
  };

  // Handle view modal
  const handleViewModal = (approval: Approval) => {
    setViewModal({
      isOpen: true,
      title: "Approval Details",
      content: (
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Status
            </label>
            <div className="mt-1">
              <StatusApproval status={approval.status} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Note
            </label>
            <div className="mt-1 text-sm text-gray-900 bg-gray-50 p-3 rounded-md border border-blue-500">
              <HtmlRenderer html={approval.note || "No note provided"} />
            </div>
          </div>
        </div>
      ),
    });
  };

  const closeViewModal = () => {
    setViewModal({
      isOpen: false,
      title: "",
      content: null,
    });
  };

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
                    sortedApprovals.length > 0 &&
                    selectedApprovals.length === sortedApprovals.length
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("workProgram")}
              >
                <div className="flex items-center">
                  Work Program
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="workProgram"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("requester")}
              >
                <div className="flex items-center">
                  Requester
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="requester"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Date
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="createdAt"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedApprovals.map((approval, index) => (
              <tr
                key={approval.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedApprovals.includes(approval.id)}
                    onChange={() => onApprovalSelect(approval.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {getEntityName(approval)}
                  </div>
                  <div className="text-sm text-gray-500">Work Program</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {approval.user?.name}
                  </div>
                  <div className="text-sm text-gray-500">
                    {approval.user?.email}
                  </div>
                  <div className="text-xs text-gray-400">
                    {approval.user?.role && formatEnumValue(approval.user.role)}
                    {approval.user?.department &&
                      ` • ${formatEnumValue(approval.user.department)}`}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusApproval status={approval.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(approval.createdAt).toLocaleDateString()}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedApprovals.length - 1}
                    hasMultipleItems={sortedApprovals.length > 1}
                  >
                    {approval.status === "PENDING" ? (
                      <>
                        <DropdownMenuItem
                          onClick={() =>
                            handleActionModal("Approve Approval", (note) =>
                              onApproveApproval(approval.id, note)
                            )
                          }
                          color="green"
                        >
                          <FiCheck className="mr-2" size={14} />
                          Approve
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleActionModal("Reject Approval", (note) =>
                              onRejectApproval(approval.id, note)
                            )
                          }
                          color="red"
                        >
                          <FiX className="mr-2" size={14} />
                          Reject
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() =>
                            handleActionModal("Request Revision", (note) =>
                              onRequestRevision(approval.id, note)
                            )
                          }
                          color="yellow"
                        >
                          <FiClock className="mr-2" size={14} />
                          Request Revision
                        </DropdownMenuItem>
                      </>
                    ) : (
                      <>
                        <DropdownMenuItem
                          onClick={() => onReturnApproval(approval.id)}
                          color="purple"
                        >
                          <FiRotateCcw className="mr-2" size={14} />
                          Return
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={() => handleViewModal(approval)}
                          color="default"
                        >
                          <FiEye className="mr-2" size={14} />
                          View Details
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedApprovals.length === 0 && (
        <EmptyState
          icon={<FiCheck size={48} className="mx-auto" />}
          title="No work program approvals found"
          description="No work program approval requests at the moment"
        />
      )}

      {sortedApprovals.length > 0 && (
        <Pagination
          usersLength={sortedApprovals.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      <ApprovalActionModal
        isOpen={actionModal.isOpen}
        title={actionModal.title}
        onClose={closeActionModal}
        onConfirm={actionModal.onConfirm}
      />

      <ViewModal
        isOpen={viewModal.isOpen}
        title={viewModal.title}
        onClose={closeViewModal}
      >
        {viewModal.content}
      </ViewModal>
    </div>
  );
}
