"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { ApprovalApi } from "@/use-cases/api/approval";
import type { ApprovalWithRelations } from "@/types/approval";
import { StatusApproval } from "@/types/enums";

interface AlertState {
  type: "success" | "error";
  message: string;
}

interface ActionModalState {
  isOpen: boolean;
  title: string;
  action: "approve" | "reject" | "revision" | "return" | null;
}

export function useLetterApproval() {
  const [approvals, setApprovals] = useState<ApprovalWithRelations[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<AlertState | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    entityType: "LETTER",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [selectedApprovals, setSelectedApprovals] = useState<string[]>([]);
  const [selectedApprovalData, setSelectedApprovalData] = useState<
    Array<{ id: string; status: string }>
  >([]);
  const [actionModal, setActionModal] = useState<ActionModalState>({
    isOpen: false,
    title: "",
    action: null,
  });

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      setAlert(null);
      const response = await ApprovalApi.getApprovals({
        status: filters.status,
        entityType: filters.entityType,
        page: currentPage,
        limit: 10,
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else if (response.data) {
        setApprovals(response.data.approvals);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to fetch approvals" });
    } finally {
      setLoading(false);
    }
  }, [filters, currentPage]);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  const handleFilterChange = useCallback((key: string, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  }, []);

  const handleApprovalSelect = useCallback((approvalId: string) => {
    setSelectedApprovals((prev) =>
      prev.includes(approvalId)
        ? prev.filter((id) => id !== approvalId)
        : [...prev, approvalId]
    );
  }, []);

  const uniqueApprovals = useMemo(() => {
    const grouped = approvals.reduce((acc, approval) => {
      const key = `${approval.entityType}-${approval.entityId}`;
      if (
        !acc[key] ||
        new Date(approval.createdAt) > new Date(acc[key].createdAt)
      ) {
        acc[key] = approval;
      }
      return acc;
    }, {} as Record<string, ApprovalWithRelations>);

    return Object.values(grouped);
  }, [approvals]);

  const filteredApprovals = useMemo(
    () =>
      uniqueApprovals.filter((approval) => {
        const matchesSearch =
          approval.user?.name
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          approval.user?.email
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          (approval.letter?.regarding || "")
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesSearch;
      }),
    [uniqueApprovals, searchTerm]
  );

  const handleSelectAll = useCallback(() => {
    setSelectedApprovals((prev) =>
      prev.length === filteredApprovals.length
        ? []
        : filteredApprovals.map((approval) => approval.id)
    );
  }, [filteredApprovals]);

  const handlePageChange = useCallback((page: number) => {
    setCurrentPage(page);
  }, []);

  const handleApprove = useCallback(
    async (approvalId: string) => {
      try {
        const response = await ApprovalApi.updateApproval(approvalId, {
          status: StatusApproval.APPROVED,
          note: "Approved by admin",
        });

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else {
          setAlert({
            type: "success",
            message: "Letter approval updated successfully",
          });
          fetchApprovals();
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to update approval" });
      }
    },
    [fetchApprovals]
  );

  const handleReject = useCallback(
    async (approvalId: string) => {
      try {
        const response = await ApprovalApi.updateApproval(approvalId, {
          status: StatusApproval.REJECTED,
          note: "Rejected by admin",
        });

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else {
          setAlert({
            type: "success",
            message: "Letter approval updated successfully",
          });
          fetchApprovals();
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to update approval" });
      }
    },
    [fetchApprovals]
  );

  const handleRequestRevision = useCallback(
    async (approvalId: string) => {
      try {
        const response = await ApprovalApi.updateApproval(approvalId, {
          status: StatusApproval.CANCELLED,
          note: "Please revise and resubmit",
        });

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else {
          setAlert({
            type: "success",
            message: "Letter approval updated successfully",
          });
          fetchApprovals();
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to update approval" });
      }
    },
    [fetchApprovals]
  );

  const handleReturn = useCallback(
    async (approvalId: string) => {
      try {
        const response = await ApprovalApi.updateApproval(approvalId, {
          status: StatusApproval.CANCELLED,
          note: "Returned for review",
        });

        if (response.error) {
          setAlert({ type: "error", message: response.error });
        } else {
          setAlert({
            type: "success",
            message: "Letter approval updated successfully",
          });
          fetchApprovals();
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to update approval" });
      }
    },
    [fetchApprovals]
  );

  const handleBulkApprove = useCallback(() => {
    setActionModal({
      isOpen: true,
      title: "Approve Selected Approvals",
      action: "approve",
    });
  }, []);

  const handleBulkReject = useCallback(() => {
    setActionModal({
      isOpen: true,
      title: "Reject Selected Approvals",
      action: "reject",
    });
  }, []);

  const handleBulkRequestRevision = useCallback(() => {
    setActionModal({
      isOpen: true,
      title: "Request Revision for Selected Approvals",
      action: "revision",
    });
  }, []);

  const handleBulkReturn = useCallback(() => {
    setActionModal({
      isOpen: true,
      title: "Return Selected Approvals",
      action: "return",
    });
  }, []);

  const closeActionModal = useCallback(() => {
    setActionModal({ isOpen: false, title: "", action: null });
  }, []);

  const handleBulkActionConfirm = useCallback(
    async (note: string) => {
      if (!actionModal.action || selectedApprovals.length === 0) return;

      try {
        setLoading(true);
        const statusMap = {
          approve: StatusApproval.APPROVED,
          reject: StatusApproval.REJECTED,
          revision: StatusApproval.CANCELLED,
          return: StatusApproval.CANCELLED,
        };

        const noteMap = {
          approve: note || "Approved by admin",
          reject: note || "Rejected by admin",
          revision: note || "Please revise and resubmit",
          return: note || "Returned for review",
        };

        const promises = selectedApprovals.map((id) =>
          ApprovalApi.updateApproval(id, {
            status: statusMap[actionModal.action!],
            note: noteMap[actionModal.action!],
          })
        );

        const results = await Promise.all(promises);
        const errors = results.filter((result) => result.error);

        if (errors.length > 0) {
          setAlert({
            type: "error",
            message: "Some approvals failed to update",
          });
        } else {
          setAlert({
            type: "success",
            message: "All selected approvals updated successfully",
          });
          setSelectedApprovals([]);
          setSelectedApprovalData([]);
          fetchApprovals();
          setTimeout(() => setAlert(null), 3000);
        }
      } catch (_error) {
        setAlert({ type: "error", message: "Failed to update approvals" });
      } finally {
        setLoading(false);
        closeActionModal();
      }
    },
    [actionModal.action, selectedApprovals, fetchApprovals, closeActionModal]
  );

  // Update selectedApprovalData when selectedApprovals changes
  useEffect(() => {
    const data = selectedApprovals.map((id) => {
      const approval = approvals.find((a) => a.id === id);
      return { id, status: approval?.status || "" };
    });
    setSelectedApprovalData(data);
  }, [selectedApprovals, approvals]);

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
}
