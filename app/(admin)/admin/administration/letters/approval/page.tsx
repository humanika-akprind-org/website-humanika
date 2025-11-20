"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheck,
  FiX,
  FiClock,
  FiMail,
  FiEye,
  FiChevronDown,
} from "react-icons/fi";
import { ApprovalApi } from "@/use-cases/api/approval";
import type { Approval } from "@/types/approval";
import { StatusApproval } from "@/types/enums";

// Helper function to format enum values for display
const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// Helper function to get status badge class
const getStatusClass = (status: string) => {
  switch (status) {
    case "APPROVED":
      return "bg-green-100 text-green-800";
    case "REJECTED":
      return "bg-red-100 text-red-800";
    case "PENDING":
      return "bg-yellow-100 text-yellow-800";
    case "CANCELLED":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

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

export default function LetterApprovalPage() {
  const [approvals, setApprovals] = useState<Approval[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState({
    status: "",
    entityType: "LETTER", // Fixed to letters only
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
        setSuccess("Letter approval updated successfully");
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
        setSuccess("Letter approval updated successfully");
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
        setSuccess("Letter approval updated successfully");
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
    setFilters({ status: "", entityType: "LETTER" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  const uniqueApprovals = useMemo(() => {
    // Group approvals by entityType and entityId, keeping only the latest (by createdAt)
    const grouped = approvals.reduce((acc, approval) => {
      const key = `${approval.entityType}-${approval.entityId}`;
      if (
        !acc[key] ||
        new Date(approval.createdAt) > new Date(acc[key].createdAt)
      ) {
        acc[key] = approval;
      }
      return acc;
    }, {} as Record<string, Approval>);

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
          getEntityName(approval)
            .toLowerCase()
            .includes(searchTerm.toLowerCase());

        return matchesSearch;
      }),
    [uniqueApprovals, searchTerm]
  );

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Letter Approvals</h1>
          <p className="text-gray-600 mt-1">
            Review and manage letter approval requests
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
      <div className="bg-white p-4 rounded-xl shadow-sm mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search by user name, email, or letter regarding..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          <button
            className="flex items-center px-4 py-2.5 border border-gray-200 rounded-lg hover:bg-gray-50"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <FiFilter className="mr-2 text-gray-500" />
            Filters
            <FiChevronDown
              className={`ml-2 transition-transform ${
                isFilterOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* Advanced Filters */}
        {isFilterOpen && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                value={filters.status}
                onChange={(e) => handleFilterChange("status", e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">All Status</option>
                <option value="PENDING">Pending</option>
                <option value="APPROVED">Approved</option>
                <option value="REJECTED">Rejected</option>
                <option value="CANCELLED">Cancelled</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={clearFilters}
                className="bg-gray-500 text-white px-4 py-2.5 rounded-lg hover:bg-gray-600 transition-colors w-full"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Approvals Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        {loading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="mt-2 text-gray-600">Loading letter approvals...</p>
          </div>
        ) : filteredApprovals.length === 0 ? (
          <div className="p-8 text-center">
            <div className="text-gray-400 mb-2">
              <FiMail size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No letter approvals found
            </p>
            <p className="text-gray-400 mt-1">
              {searchTerm || filters.status
                ? "Try adjusting your search or filter criteria"
                : "No letter approval requests at the moment"}
            </p>
          </div>
        ) : (
          <>
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Letter
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requester
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredApprovals.map((approval) => (
                  <tr key={approval.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {getEntityName(approval)}
                      </div>
                      <div className="text-sm text-gray-500">Letter</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {approval.user?.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {approval.user?.email}
                      </div>
                      <div className="text-xs text-gray-400">
                        {approval.user?.role &&
                          formatEnumValue(approval.user.role)}
                        {approval.user?.department &&
                          ` • ${formatEnumValue(approval.user.department)}`}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(
                          approval.status
                        )}`}
                      >
                        {formatEnumValue(approval.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(approval.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        {approval.status === "PENDING" && (
                          <>
                            <button
                              onClick={() => handleApprove(approval.id)}
                              className="text-green-600 hover:text-green-900 px-2 py-1 rounded hover:bg-green-50 flex items-center"
                              title="Approve"
                            >
                              <FiCheck className="mr-1" size={14} />
                              Approve
                            </button>
                            <button
                              onClick={() => handleReject(approval.id)}
                              className="text-red-600 hover:text-red-900 px-2 py-1 rounded hover:bg-red-50 flex items-center"
                              title="Reject"
                            >
                              <FiX className="mr-1" size={14} />
                              Reject
                            </button>
                            <button
                              onClick={() => handleRequestRevision(approval.id)}
                              className="text-blue-600 hover:text-blue-900 px-2 py-1 rounded hover:bg-blue-50 flex items-center"
                              title="Request Revision"
                            >
                              <FiClock className="mr-1" size={14} />
                              Revision
                            </button>
                          </>
                        )}
                        <button
                          className="text-gray-600 hover:text-gray-900 px-2 py-1 rounded hover:bg-gray-50 flex items-center"
                          title="View Details"
                        >
                          <FiEye className="mr-1" size={14} />
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
                <p className="text-sm text-gray-700 mb-4 sm:mb-0">
                  Showing{" "}
                  <span className="font-medium">
                    {filteredApprovals.length}
                  </span>{" "}
                  of{" "}
                  <span className="font-medium">{uniqueApprovals.length}</span>{" "}
                  letter approvals
                </p>
                <div className="flex space-x-2">
                  <button
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </button>
                  <button
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                    }
                    disabled={currentPage === totalPages}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
