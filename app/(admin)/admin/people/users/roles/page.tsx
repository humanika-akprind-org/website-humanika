// app/(admin)/admin/people/users/verify-accounts/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  FiSearch,
  FiFilter,
  FiCheckCircle,
  FiMail,
  FiUser,
  FiUserX,
  FiChevronDown,
  FiRefreshCw,
  FiSend,
} from "react-icons/fi";

// Enum values from Prisma
enum UserRole {
  DPO = "DPO",
  BPH = "BPH",
  PENGURUS = "PENGURUS",
  ANGGOTA = "ANGGOTA",
}

enum Department {
  INFOKOM = "INFOKOM",
  PSDM = "PSDM",
  LITBANG = "LITBANG",
  KWU = "KWU",
}

enum Position {
  KETUA_UMUM = "KETUA_UMUM",
  WAKIL_KETUA_UMUM = "WAKIL_KETUA_UMUM",
  SEKRETARIS = "SEKRETARIS",
  BENDAHARA = "BENDAHARA",
  KEPALA_DEPARTEMEN = "KEPALA_DEPARTEMEN",
  STAFF_DEPARTEMEN = "STAFF_DEPARTEMEN",
}

interface User {
  id: string;
  name: string;
  email: string;
  username: string;
  role: UserRole;
  department?: Department;
  position?: Position;
  isActive: boolean;
  verifiedAccount: boolean;
  attemptLogin: number;
  blockExpires?: string;
  createdAt: string;
  updatedAt: string;
  avatarColor: string;
}

interface UsersResponse {
  users: User[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

interface ApiResponse<T> {
  data?: T;
  error?: string;
}

// Helper function to format enum values for display
const formatEnumValue = (value: string) =>
  value
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

// Get all enum values as options for select inputs
const userRoleOptions = Object.values(UserRole).map((role) => ({
  value: role,
  label: formatEnumValue(role),
}));

const departmentOptions = Object.values(Department).map((dept) => ({
  value: dept,
  label: formatEnumValue(dept),
}));

class UserApi {
  private static API_BASE_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

  private static async fetchApi<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${endpoint}`, {
        headers: {
          "Content-Type": "application/json",
          ...options.headers,
        },
        ...options,
      });

      const data = await response.json();

      if (!response.ok) {
        return { error: data.error || "An error occurred" };
      }

      return { data };
    } catch (_error) {
      return { error: "Network error occurred" };
    }
  }

  static async getUnverifiedUsers(params?: {
    search?: string;
    role?: UserRole;
    department?: Department;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<UsersResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.department) queryParams.append("department", params.department);
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    // Add filter for unverified accounts
    queryParams.append("verifiedAccount", "false");

    const queryString = queryParams.toString();
    const endpoint = `/user${queryString ? `?${queryString}` : ""}`;

    return this.fetchApi<UsersResponse>(endpoint);
  }

  static async verifyUser(id: string): Promise<ApiResponse<User>> {
    return this.fetchApi<User>(`/user/${id}/verify`, {
      method: "PATCH",
    });
  }

  static async sendVerificationEmail(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/user/${id}/send-verification`, {
      method: "POST",
    });
  }

  static async bulkVerifyUsers(
    ids: string[]
  ): Promise<ApiResponse<{ count: number }>> {
    return this.fetchApi<{ count: number }>("/user/bulk-verify", {
      method: "POST",
      body: JSON.stringify({ userIds: ids }),
    });
  }

  static async bulkSendVerification(
    ids: string[]
  ): Promise<ApiResponse<{ count: number }>> {
    return this.fetchApi<{ count: number }>("/user/bulk-send-verification", {
      method: "POST",
      body: JSON.stringify({ userIds: ids }),
    });
  }
}

export default function VerifyAccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [selectedUsers, setSelectedUsers] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({
    role: "" as UserRole | "",
    department: "" as Department | "",
  });
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [processingIds, setProcessingIds] = useState<string[]>([]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await UserApi.getUnverifiedUsers({
        search: searchTerm,
        role: filters.role || undefined,
        department: filters.department || undefined,
        page: currentPage,
        limit: 10,
      });

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        const usersWithColors = response.data.users.map((user, index) => ({
          ...user,
          avatarColor: [
            "bg-blue-500",
            "bg-pink-500",
            "bg-purple-500",
            "bg-green-500",
            "bg-yellow-500",
            "bg-red-500",
            "bg-indigo-500",
            "bg-teal-500",
          ][index % 8],
        }));
        setUsers(usersWithColors);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (_error) {
      setError("Failed to fetch unverified users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage, filters]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filters.role === "" || user.role === filters.role;
    const matchesDepartment =
      filters.department === "" || user.department === filters.department;

    return matchesSearch && matchesRole && matchesDepartment;
  });

  // Toggle user selection
  const toggleUserSelection = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  // Select all users on current page
  const toggleSelectAll = () => {
    if (selectedUsers.length === filteredUsers.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(filteredUsers.map((user) => user.id));
    }
  };

  // Verify a single user
  const handleVerifyUser = async (userId: string) => {
    try {
      setProcessingIds([...processingIds, userId]);
      const response = await UserApi.verifyUser(userId);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("User verified successfully");
        // Remove the user from the list
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      }
    } catch (_error) {
      setError("Failed to verify user");
    } finally {
      setProcessingIds(processingIds.filter((id) => id !== userId));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Send verification email to a single user
  const handleSendVerification = async (userId: string) => {
    try {
      setProcessingIds([...processingIds, userId]);
      const response = await UserApi.sendVerificationEmail(userId);

      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Verification email sent successfully");
      }
    } catch (_error) {
      setError("Failed to send verification email");
    } finally {
      setProcessingIds(processingIds.filter((id) => id !== userId));
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Bulk verify users
  const handleBulkVerify = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setProcessingIds([...processingIds, ...selectedUsers]);
      const response = await UserApi.bulkVerifyUsers(selectedUsers);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSuccess(`${response.data.count} users verified successfully`);
        // Remove verified users from the list
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      }
    } catch (_error) {
      setError("Failed to verify users");
    } finally {
      setProcessingIds(
        processingIds.filter((id) => !selectedUsers.includes(id))
      );
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Bulk send verification emails
  const handleBulkSendVerification = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setProcessingIds([...processingIds, ...selectedUsers]);
      const response = await UserApi.bulkSendVerification(selectedUsers);

      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setSuccess(`Verification emails sent to ${response.data.count} users`);
      }
    } catch (_error) {
      setError("Failed to send verification emails");
    } finally {
      setProcessingIds(
        processingIds.filter((id) => !selectedUsers.includes(id))
      );
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ role: "", department: "" });
    setSearchTerm("");
    setCurrentPage(1);
  };

  // Format date
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            Account Verification
          </h1>
          <p className="text-gray-600 mt-1">
            Manage unverified user accounts and send verification emails
          </p>
        </div>
        <div className="flex space-x-2 mt-4 md:mt-0">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50"
            onClick={handleBulkSendVerification}
            disabled={selectedUsers.length === 0 || processingIds.length > 0}
          >
            <FiSend className="mr-2" />
            Send Verification ({selectedUsers.length})
          </button>
          <button
            className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center disabled:opacity-50"
            onClick={handleBulkVerify}
            disabled={selectedUsers.length === 0 || processingIds.length > 0}
          >
            <FiCheckCircle className="mr-2" />
            Verify Accounts ({selectedUsers.length})
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Unverified Users
            </h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiUserX className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Selected Users
            </h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUser className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {selectedUsers.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Processing</h3>
            <div className="p-2 bg-purple-100 rounded-lg">
              <FiRefreshCw className="text-purple-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {processingIds.length}
          </p>
        </div>
      </div>

      {/* Success Message */}
      {success && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {success}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* Filters and Search */}
      <div className="bg-white rounded-xl shadow-sm p-5 mb-6 border border-gray-100">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FiSearch className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search unverified users by name, email or username..."
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.role}
                onChange={(e) => handleFilterChange("role", e.target.value)}
              >
                <option value="">All Roles</option>
                {userRoleOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Department
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.department}
                onChange={(e) =>
                  handleFilterChange("department", e.target.value)
                }
              >
                <option value="">All Departments</option>
                {departmentOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                className="px-4 py-2.5 text-gray-700 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors w-full"
                onClick={clearFilters}
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
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredUsers.length > 0 &&
                      selectedUsers.length === filteredUsers.length
                    }
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    disabled={processingIds.length > 0}
                  />
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
                  Role
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
                  Status
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
              {filteredUsers.map((user) => (
                <tr
                  key={user.id}
                  className="hover:bg-gray-50 transition-colors"
                >
                  <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                    <input
                      type="checkbox"
                      checked={selectedUsers.includes(user.id)}
                      onChange={() => toggleUserSelection(user.id)}
                      className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      disabled={processingIds.includes(user.id)}
                    />
                  </td>
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
                        <div className="text-xs text-gray-400">
                          @{user.username}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                      {formatEnumValue(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department ? formatEnumValue(user.department) : "-"}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                        user.isActive
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                    {!user.verifiedAccount && (
                      <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                        Unverified
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors disabled:opacity-50"
                        onClick={() => handleSendVerification(user.id)}
                        disabled={processingIds.includes(user.id)}
                        title="Send verification email"
                      >
                        <FiSend size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors disabled:opacity-50"
                        onClick={() => handleVerifyUser(user.id)}
                        disabled={processingIds.includes(user.id)}
                        title="Verify account"
                      >
                        <FiCheckCircle size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredUsers.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <FiCheckCircle size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">
              All accounts are verified
            </p>
            <p className="text-gray-400 mt-1">No unverified accounts found</p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading unverified users...</p>
          </div>
        )}

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> unverified
              users
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1 || processingIds.length > 0}
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={
                  currentPage === totalPages || processingIds.length > 0
                }
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
