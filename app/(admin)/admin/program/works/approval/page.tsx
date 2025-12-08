"use client";

import { useState, useEffect, useCallback } from "react";
import { ApprovalApi } from "@/use-cases/api/approval";
import type { ApprovalWithRelations as Approval } from "@/types/approval";
import ApprovalFilters from "@/components/admin/approval/Filters";
import ApprovalTable from "@/components/admin/approval/Table";
import { StatusApproval } from "@/types/enums";
import ApprovalActionModal from "@/components/admin/approval/ActionModal";

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
      return approval.entityType;
  }
};

export default function WorkProgramApprovalPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    entityType: "WORK_PROGRAM", // Fixed to work programs only
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    action: "",
  });

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setError("");
      const response = await ApprovalApi.getApprovals({
        status: filters.status,
        entityType: filters.entityType,
        page: currentPage,
        limit: 10,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        // Group approvals by work program ID and keep only the latest one per work program
        const uniqueApprovalsMap = response.data.approvals.reduce(
          (acc, approval) => {
            const workProgramId = approval.workProgram?.id || approval.entityId;
            if (
              !acc[workProgramId] ||
              new Date(approval.createdAt) >
                new Date(acc[workProgramId].createdAt)
            ) {
              acc[workProgramId] = approval;
            }
            return acc;
          },
          {} as Record<string, Approval>
        );

        const uniqueApprovals = Object.values(uniqueApprovalsMap) as Approval[];

        // Sort by createdAt descending to show latest first
        uniqueApprovals.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );

        setApprovals(uniqueApprovals);
        setTotalPages(1); // Disable pagination for unique approvals
      }
    } catch (_error) {
      setError("Failed to fetch approvals");
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleApprove = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.APPROVED,
        note: note || "Approved by admin",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Work program approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleReject = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.REJECTED,
        note: note || "Rejected by admin",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Work program approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleRequestRevision = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.CANCELLED,
        note: note || "Please revise and resubmit",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Work program approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleReturn = async (approvalId: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.PENDING,
        note: "Approval returned to pending status",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Work program approval returned to pending successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to return approval");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const handleApprovalSelect = (id: string) => {
    setSelectedApprovals((prev) =>
      prev.includes(id)
        ? prev.filter((approvalId) => approvalId !== id)
        : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    setSelectedApprovals((prev) =>
      prev.length === filteredApprovals.length
        ? []
        : filteredApprovals.map((approval) => approval.id)
    );
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleBulkApprove = () => {
    setActionModal({
      isOpen: true,
      title: "Bulk Approve Approvals",
      action: "approve",
    });
  };

  const handleBulkReject = () => {
    setActionModal({
      isOpen: true,
      title: "Bulk Reject Approvals",
      action: "reject",
    });
  };

  const handleBulkRequestRevision = () => {
    setActionModal({
      isOpen: true,
      title: "Bulk Request Revision",
      action: "revision",
    });
  };

  const handleBulkReturn = () => {
    setActionModal({
      isOpen: true,
      title: "Bulk Return Approvals",
      action: "return",
    });
  };

  const handleBulkActionConfirm = async (note: string) => {
    try {
      let successMessage = "";
      for (const approvalId of selectedApprovals) {
        let response;
        switch (actionModal.action) {
          case "approve":
            response = await ApprovalApi.updateApproval(approvalId, {
              status: StatusApproval.APPROVED,
              note: note || "Approved by admin",
            });
            successMessage = "Approvals approved successfully";
            break;
          case "reject":
            response = await ApprovalApi.updateApproval(approvalId, {
              status: StatusApproval.REJECTED,
              note: note || "Rejected by admin",
            });
            successMessage = "Approvals rejected successfully";
            break;
          case "revision":
            response = await ApprovalApi.updateApproval(approvalId, {
              status: StatusApproval.CANCELLED,
              note: note || "Please revise and resubmit",
            });
            successMessage = "Revision requests sent successfully";
            break;
          case "return":
            response = await ApprovalApi.updateApproval(approvalId, {
              status: StatusApproval.PENDING,
              note: "Approval returned to pending status",
            });
            successMessage = "Approvals returned successfully";
            break;
        }
        if (response?.error) {
          setError(response.error);
          return;
        }
      }
      setSuccess(successMessage);
      setSelectedApprovals([]);
      fetchApprovals();
      setTimeout(() => setSuccess(""), 3000);
    } catch (_error) {
      setError("Failed to perform bulk action");
    }
  };

  const closeActionModal = () => {
    setActionModal({
      isOpen: false,
      title: "",
      action: "",
    });
  };

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEntityName(approval).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const selectedApprovalData = approvals
    .filter((approval) => selectedApprovals.includes(approval.id))
    .map((approval) => ({ id: approval.id, status: approval.status }));

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Work Program Approvals
          </h1>
          <p className="text-gray-600 mt-1">
            Review and manage work program approval requests
          </p>
        </div>
      </div>

      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

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
        approvals={filteredApprovals}
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
