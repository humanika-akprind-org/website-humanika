import { useState, useEffect, useCallback } from "react";
import { ApprovalApi } from "use-cases/api/approval";
import type { Approval } from "types/approval";
import { StatusApproval } from "@/types/enums";

export function useDocumentApprovals() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    entityType: "DOCUMENT", // Fixed to documents only
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

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
        setApprovals(response.data.approvals);
        setTotalPages(response.data.pagination.pages);
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

  const handleApprove = async (approvalId: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.APPROVED,
        note: "Approved by admin",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Document approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleReject = async (approvalId: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.REJECTED,
        note: "Rejected by admin",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Document approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleRequestRevision = async (approvalId: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.CANCELLED,
        note: "Please revise and resubmit",
      });

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Document approval updated successfully");
        fetchApprovals();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to update approval");
    }
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ status: "", entityType: "DOCUMENT" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const filteredApprovals = approvals.filter((approval) => {
    const matchesSearch =
      approval.user?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      approval.user?.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getEntityName(approval).toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  return {
    approvals: filteredApprovals,
    loading,
    error,
    success,
    searchTerm,
    setSearchTerm,
    filters,
    isFilterOpen,
    setIsFilterOpen,
    currentPage,
    setCurrentPage,
    totalPages,
    handleApprove,
    handleReject,
    handleRequestRevision,
    handleFilterChange,
    clearFilters,
  };
}

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
      return approval.entityType
        .toLowerCase()
        .replace(/_/g, " ")
        .replace(/\b\w/g, (l) => l.toUpperCase());
  }
};
