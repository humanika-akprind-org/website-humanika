import { useState, useEffect, useCallback } from "react";
import { ApprovalApi } from "use-cases/api/approval";
import type { ApprovalWithRelations as Approval } from "types/approval";
import { StatusApproval } from "types/enums";

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

export const useDocumentApproval = (documentType?: string) => {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    entityType: "DOCUMENT",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);

  const [actionModal, setActionModal] = useState({
    isOpen: false,
    title: "",
    action: "",
  });

  const fetchApprovals = useCallback(
    async (docType?: string) => {
      try {
        setLoading(true);
        const response = await ApprovalApi.getApprovals({
          status: filters.status,
          entityType: filters.entityType,
          page: currentPage,
          limit: 10,
        });

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else if (response.data) {
          // Group approvals by document ID and keep only the latest one per document
          const uniqueApprovalsMap = response.data.approvals.reduce(
            (acc, approval) => {
              const documentId = approval.document?.id || approval.entityId;
              if (
                !acc[documentId] ||
                new Date(approval.createdAt) >
                  new Date(acc[documentId].createdAt)
              ) {
                acc[documentId] = approval;
              }
              return acc;
            },
            {} as Record<string, Approval>
          );

          const uniqueApprovals = Object.values(
            uniqueApprovalsMap
          ) as Approval[];

          // Filter based on documentType parameter if provided
          const filteredApprovals = uniqueApprovals.filter((approval) => {
            if (!docType) {
              // If no documentType specified, show all documents
              return true;
            }
            const approvalDocType = approval.document?.documentType?.name
              ?.toLowerCase()
              .replace(/[\s\-]/g, "");
            return (
              approvalDocType === docType.toLowerCase().replace(/[\s\-]/g, "")
            );
          });

          // Sort by createdAt descending to show latest first
          filteredApprovals.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );

          setApprovals(filteredApprovals);
          setTotalPages(1); // Disable pagination for unique approvals
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to fetch approvals" });
      } finally {
        setLoading(false);
      }
    },
    [filters, currentPage]
  );

  useEffect(() => {
    fetchApprovals(documentType);
  }, [fetchApprovals, documentType]);

  const handleApprove = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.APPROVED,
        note: note || "Approved by admin",
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({
          type: "success",
          message: "Document approval updated successfully",
        });
        fetchApprovals();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to update approval" });
    }
  };

  const handleReject = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.REJECTED,
        note: note || "Rejected by admin",
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({
          type: "success",
          message: "Document approval updated successfully",
        });
        fetchApprovals();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to update approval" });
    }
  };

  const handleRequestRevision = async (approvalId: string, note?: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.CANCELLED,
        note: note || "Please revise and resubmit",
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({
          type: "success",
          message: "Document approval updated successfully",
        });
        fetchApprovals();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to update approval" });
    }
  };

  const handleReturn = async (approvalId: string) => {
    try {
      const response = await ApprovalApi.updateApproval(approvalId, {
        status: StatusApproval.PENDING,
        note: "Approval returned to pending status",
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({
          type: "success",
          message: "Document approval returned to pending successfully",
        });
        fetchApprovals();
        setTimeout(() => setAlert(null), 3000);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to return approval" });
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
          setAlert({ type: "error", message: response.error });
          return;
        }
      }
      setAlert({ type: "success", message: successMessage });
      setSelectedApprovals([]);
      fetchApprovals();
      setTimeout(() => setAlert(null), 3000);
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to perform bulk action" });
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

  return {
    approvals: filteredApprovals,
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
  };
};
