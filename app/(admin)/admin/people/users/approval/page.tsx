// app/dashboard/user/approval/page.tsx
"use client";

import { useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiXCircle,
  FiEye,
  FiChevronDown,
  FiUserPlus,
  FiClock,
  FiUserCheck,
  FiUserX,
  FiMail,
  FiX,
} from "react-icons/fi";

interface PendingUser {
  id: number;
  name: string;
  email: string;
  department: string;
  role: string;
  requestedRole: string;
  requestedAt: string;
  status: "pending" | "approved" | "rejected";
  avatarColor: string;
  justification: string;
}

export default function UserApprovalPage() {
  const [pendingUsers, setPendingUsers] = useState<PendingUser[]>([
    {
      id: 1,
      name: "Alex Johnson",
      email: "alex.j@organization.org",
      department: "Marketing",
      role: "N/A",
      requestedRole: "Editor",
      requestedAt: "2023-10-22 14:30:25",
      status: "pending",
      avatarColor: "bg-blue-500",
      justification: "Need access to edit marketing content and campaigns",
    },
    {
      id: 2,
      name: "Maria Garcia",
      email: "maria.g@organization.org",
      department: "Finance",
      role: "N/A",
      requestedRole: "Viewer",
      requestedAt: "2023-10-21 09:15:42",
      status: "pending",
      avatarColor: "bg-pink-500",
      justification: "Require read-only access to financial reports",
    },
    {
      id: 3,
      name: "James Wilson",
      email: "james.w@organization.org",
      department: "Operations",
      role: "N/A",
      requestedRole: "Manager",
      requestedAt: "2023-10-20 16:45:18",
      status: "pending",
      avatarColor: "bg-purple-500",
      justification: "Team lead requiring management access for my department",
    },
    {
      id: 4,
      name: "Sarah Thompson",
      email: "sarah.t@organization.org",
      department: "IT",
      role: "N/A",
      requestedRole: "Administrator",
      requestedAt: "2023-10-19 11:20:35",
      status: "pending",
      avatarColor: "bg-green-500",
      justification:
        "IT support team requires admin access for system maintenance",
    },
    {
      id: 5,
      name: "David Kim",
      email: "david.k@organization.org",
      department: "HR",
      role: "N/A",
      requestedRole: "Editor",
      requestedAt: "2023-10-18 13:05:57",
      status: "pending",
      avatarColor: "bg-yellow-500",
      justification: "Need to update employee records and documentation",
    },
  ]);

  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PendingUser | null>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");

  // Filter users based on search term and filters
  const filteredUsers = pendingUsers
    .filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((user) => statusFilter === "all" || user.status === statusFilter)
    .filter(
      (user) => roleFilter === "all" || user.requestedRole === roleFilter
    );

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get role badge class
  const getRoleClass = (role: string) => {
    switch (role) {
      case "Administrator":
        return "bg-purple-100 text-purple-800";
      case "Editor":
        return "bg-blue-100 text-blue-800";
      case "Manager":
        return "bg-indigo-100 text-indigo-800";
      case "Viewer":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
  };

  // View user details
  const viewUserDetails = (user: PendingUser) => {
    setSelectedUser(user);
    setShowDetailModal(true);
    setRejectionReason("");
  };

  // Approve user
  const approveUser = (id: number) => {
    setPendingUsers(
      pendingUsers.map((user) =>
        user.id === id ? { ...user, status: "approved" } : user
      )
    );
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: "approved" });
    }
  };

  // Reject user
  const rejectUser = (id: number) => {
    if (rejectionReason.trim() === "") {
      alert("Please provide a reason for rejection");
      return;
    }

    setPendingUsers(
      pendingUsers.map((user) =>
        user.id === id ? { ...user, status: "rejected" } : user
      )
    );
    if (selectedUser && selectedUser.id === id) {
      setSelectedUser({ ...selectedUser, status: "rejected" });
    }
    setShowDetailModal(false);
  };

  // Get stats
  const getStats = () => ({
    total: pendingUsers.length,
    pending: pendingUsers.filter((u) => u.status === "pending").length,
    approved: pendingUsers.filter((u) => u.status === "approved").length,
    rejected: pendingUsers.filter((u) => u.status === "rejected").length,
  });

  const stats = getStats();

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Approval</h1>
          <p className="text-gray-600 mt-1">
            Review and approve new user registration requests
          </p>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Total Requests
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUserPlus className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Pending Review
            </h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiClock className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {stats.pending}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Approved</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUserCheck className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {stats.approved}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Rejected</h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <FiUserX className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {stats.rejected}
          </p>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search users by name or email..."
              className="pl-10 w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Requested Role
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">All Roles</option>
                <option value="Administrator">Administrator</option>
                <option value="Editor">Editor</option>
                <option value="Viewer">Viewer</option>
                <option value="Manager">Manager</option>
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="px-4 py-2.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors w-full flex items-center justify-center"
                onClick={() => {
                  setSearchTerm("");
                  setStatusFilter("all");
                  setRoleFilter("all");
                }}
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
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
                  Requested Role
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Department
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Requested At
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="px-4 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div
                        className={`flex-shrink-0 h-10 w-10 rounded-full flex items-center justify-center text-white ${user.avatarColor}`}
                      >
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {user.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <FiMail className="mr-1 text-gray-400" size={14} />
                          {user.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleClass(
                        user.requestedRole
                      )}`}
                    >
                      {user.requestedRole}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.requestedAt)}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        user.status
                      )}`}
                    >
                      {user.status.charAt(0).toUpperCase() +
                        user.status.slice(1)}
                    </span>
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => viewUserDetails(user)}
                        title="View details"
                      >
                        <FiEye size={16} />
                      </button>
                      {user.status === "pending" && (
                        <>
                          <button
                            className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                            onClick={() => approveUser(user.id)}
                            title="Approve user"
                          >
                            <FiCheckCircle size={16} />
                          </button>
                          <button
                            className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                            onClick={() => viewUserDetails(user)}
                            title="Reject user"
                          >
                            <FiXCircle size={16} />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiUserPlus size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              No pending requests
            </p>
            <p className="text-gray-400 mt-1">
              {searchTerm || statusFilter !== "all" || roleFilter !== "all"
                ? "Try adjusting your search or filter criteria"
                : "All user requests have been processed"}
            </p>
          </div>
        )}
      </div>

      {/* User Detail Modal */}
      {showDetailModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  User Request Details
                </h2>
                <button
                  onClick={() => {
                    setShowDetailModal(false);
                    setSelectedUser(null);
                    setRejectionReason("");
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="flex items-center mb-6">
                <div
                  className={`flex-shrink-0 h-16 w-16 rounded-full flex items-center justify-center text-white text-xl ${selectedUser.avatarColor}`}
                >
                  {selectedUser.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </div>
                <div className="ml-4">
                  <h3 className="text-lg font-medium text-gray-900">
                    {selectedUser.name}
                  </h3>
                  <p className="text-gray-500 flex items-center">
                    <FiMail className="mr-1 text-gray-400" size={14} />
                    {selectedUser.email}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Department
                  </h4>
                  <p className="text-gray-900">{selectedUser.department}</p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Requested Role
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleClass(
                      selectedUser.requestedRole
                    )}`}
                  >
                    {selectedUser.requestedRole}
                  </span>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Requested At
                  </h4>
                  <p className="text-gray-900">
                    {formatDate(selectedUser.requestedAt)}
                  </p>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Status
                  </h4>
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                      selectedUser.status
                    )}`}
                  >
                    {selectedUser.status.charAt(0).toUpperCase() +
                      selectedUser.status.slice(1)}
                  </span>
                </div>
              </div>

              <div className="mb-6">
                <h4 className="text-sm font-medium text-gray-700 mb-1">
                  Justification
                </h4>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg">
                  {selectedUser.justification}
                </p>
              </div>

              {selectedUser.status === "pending" && (
                <div>
                  <h4 className="text-sm font-medium text-gray-700 mb-1">
                    Rejection Reason (if rejecting)
                  </h4>
                  <textarea
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={3}
                    placeholder="Provide a reason for rejection..."
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                  />
                </div>
              )}
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDetailModal(false);
                  setSelectedUser(null);
                  setRejectionReason("");
                }}
              >
                Close
              </button>
              {selectedUser.status === "pending" && (
                <>
                  <button
                    className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                    onClick={() => rejectUser(selectedUser.id)}
                  >
                    Reject Request
                  </button>
                  <button
                    className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
                    onClick={() => approveUser(selectedUser.id)}
                  >
                    Approve Request
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
