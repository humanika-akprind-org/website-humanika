// app/(admin)/admin/people/users/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  FiSearch,
  FiPlus,
  FiFilter,
  FiEdit,
  FiTrash2,
  FiKey,
  FiUnlock,
  FiUserCheck,
  FiUserX,
  FiX,
  FiChevronDown,
  FiMail,
  FiUsers,
  FiLock,
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

interface CreateUserData {
  name: string;
  email: string;
  username: string;
  password: string;
  role?: UserRole;
  department?: Department;
  position?: Position;
  isActive?: boolean;
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

  static async getUsers(params?: {
    search?: string;
    role?: UserRole;
    department?: Department;
    isActive?: boolean;
    page?: number;
    limit?: number;
  }): Promise<ApiResponse<UsersResponse>> {
    const queryParams = new URLSearchParams();

    if (params?.search) queryParams.append("search", params.search);
    if (params?.role) queryParams.append("role", params.role);
    if (params?.department) queryParams.append("department", params.department);
    if (params?.isActive !== undefined) queryParams.append("isActive", params.isActive.toString());
    if (params?.page) queryParams.append("page", params.page.toString());
    if (params?.limit) queryParams.append("limit", params.limit.toString());

    const queryString = queryParams.toString();
    const endpoint = `/user${queryString ? `?${queryString}` : ""}`;

    return this.fetchApi<UsersResponse>(endpoint);
  }

  static async createUser(
    userData: CreateUserData
  ): Promise<ApiResponse<User>> {
    return this.fetchApi<User>("/user", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  }

  static async updateUser(
    id: string,
    userData: Partial<CreateUserData>
  ): Promise<ApiResponse<User>> {
    return this.fetchApi<User>(`/user/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    });
  }

  static async deleteUser(
    id: string
  ): Promise<ApiResponse<{ message: string }>> {
    return this.fetchApi<{ message: string }>(`/user/${id}`, {
      method: "DELETE",
    });
  }

  static async toggleUserStatus(
    id: string,
    isActive: boolean
  ): Promise<ApiResponse<User>> {
    return this.updateUser(id, { isActive });
  }
}

export default function UsersPage() {
  const router = useRouter();
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
    isActive: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forceReset, setForceReset] = useState(false);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await UserApi.getUsers({
        search: searchTerm,
        role: filters.role || undefined,
        department: filters.department || undefined,
        isActive: filters.isActive ? filters.isActive === "true" : undefined,
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
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [searchTerm, currentPage, filters.role, filters.department]);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filters.isActive === "" ||
      (filters.isActive === "true" && user.isActive) ||
      (filters.isActive === "false" && !user.isActive);
    const matchesRole = filters.role === "" || user.role === filters.role;
    const matchesDepartment =
      filters.department === "" || user.department === filters.department;

    return matchesSearch && matchesStatus && matchesRole && matchesDepartment;
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

  // Navigate to add user page
  const handleAddUser = () => {
    router.push("/admin/people/users/add");
  };

  // Navigate to edit user page
  const handleEditUser = (id: string) => {
    router.push(`/admin/people/users/edit/${id}`);
  };

  // Delete user(s)
  const handleDelete = (user?: User) => {
    if (user) {
      setCurrentUser(user);
    }
    setShowDeleteModal(true);
  };

  // Reset password
  const handleResetPassword = (user: User) => {
    setCurrentUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setForceReset(false);
    setShowPasswordModal(true);
  };

  // Lock account
  const handleLockAccount = async (userId: string) => {
    try {
      const response = await UserApi.toggleUserStatus(userId, false);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Account locked successfully");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to lock account");
    }
  };

  // Unlock account
  const handleUnlockAccount = async (userId: string) => {
    try {
      const response = await UserApi.toggleUserStatus(userId, true);
      if (response.error) {
        setError(response.error);
      } else {
        setSuccess("Account unlocked successfully");
        fetchUsers();
        setTimeout(() => setSuccess(""), 3000);
      }
    } catch (_error) {
      setError("Failed to unlock account");
    }
  };

  // Execute deletion
  const confirmDelete = async () => {
    try {
      if (currentUser) {
        // Delete single user
        const response = await UserApi.deleteUser(currentUser.id);
        if (response.error) {
          setError(response.error);
        } else {
          setSuccess("User deleted successfully");
          fetchUsers();
        }
      } else if (selectedUsers.length > 0) {
        // Delete multiple users
        for (const userId of selectedUsers) {
          await UserApi.deleteUser(userId);
        }
        setSuccess(`${selectedUsers.length} users deleted successfully`);
        setSelectedUsers([]);
        fetchUsers();
      }
    } catch (_error) {
      setError("Failed to delete user(s)");
    } finally {
      setShowDeleteModal(false);
      setCurrentUser(null);
      setTimeout(() => setSuccess(""), 3000);
    }
  };

  // Execute password reset
  const confirmPasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    // Here you would typically make an API call to reset the password
    console.log(`Password reset for ${currentUser?.name} to: ${newPassword}`);
    console.log(`Force reset on next login: ${forceReset}`);

    setShowPasswordModal(false);
    setCurrentUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password reset successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  // Get status badge class
  const getStatusClass = (isActive: boolean) =>
    isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

  // Get role badge class
  const getRoleClass = (role: UserRole) => {
    switch (role) {
      case UserRole.DPO:
        return "bg-purple-100 text-purple-800";
      case UserRole.BPH:
        return "bg-blue-100 text-blue-800";
      case UserRole.PENGURUS:
        return "bg-indigo-100 text-indigo-800";
      case UserRole.ANGGOTA:
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
      date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
          <p className="text-gray-600 mt-1">
            Manage all system users and their permissions
          </p>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center mt-4 md:mt-0"
          onClick={handleAddUser}
        >
          <FiPlus className="mr-2" />
          Add New User
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Total Users</h3>
            <div className="p-2 bg-blue-100 rounded-lg">
              <FiUsers className="text-blue-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">Active Users</h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiUserCheck className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.filter((u) => u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Inactive Users
            </h3>
            <div className="p-2 bg-yellow-100 rounded-lg">
              <FiUserX className="text-yellow-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.filter((u) => !u.isActive).length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Verified Emails
            </h3>
            <div className="p-2 bg-green-100 rounded-lg">
              <FiMail className="text-green-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.filter((u) => u.verifiedAccount).length}
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
              placeholder="Search users by name, email or username..."
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t border-gray-100">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Status
              </label>
              <select
                className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.isActive}
                onChange={(e) => handleFilterChange("isActive", e.target.value)}
              >
                <option value="">All Status</option>
                <option value="true">Active</option>
                <option value="false">Inactive</option>
              </select>
            </div>
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
                className={`px-4 py-2.5 rounded-lg transition-colors w-full flex items-center justify-center ${
                  selectedUsers.length === 0
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-red-50 text-red-700 hover:bg-red-100"
                }`}
                onClick={() => handleDelete()}
                disabled={selectedUsers.length === 0}
              >
                <FiTrash2 className="mr-2" />
                Delete Selected ({selectedUsers.length})
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
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {formatEnumValue(user.role)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department ? formatEnumValue(user.department) : "-"}
                    {user.position && ` • ${formatEnumValue(user.position)}`}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusClass(
                        user.isActive
                      )}`}
                    >
                      {user.isActive ? "Active" : "Inactive"}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatDate(user.createdAt)}
                  </td>
                  <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                    <div className="flex items-center space-x-2">
                      <button
                        className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                        onClick={() => handleEditUser(user.id)}
                        title="Edit user"
                      >
                        <FiEdit size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                        onClick={() => handleDelete(user)}
                        title="Delete user"
                      >
                        <FiTrash2 size={16} />
                      </button>
                      <button
                        className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                        onClick={() => handleResetPassword(user)}
                        title="Reset password"
                      >
                        <FiKey size={16} />
                      </button>
                      {!user.isActive ? (
                        <button
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => handleUnlockAccount(user.id)}
                          title="Activate account"
                        >
                          <FiUnlock size={16} />
                        </button>
                      ) : (
                        <button
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                          onClick={() => handleLockAccount(user.id)}
                          title="Deactivate account"
                        >
                          <FiLock size={16} />
                        </button>
                      )}
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
              <FiUsers size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
          </div>
        )}

        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
            <p className="text-gray-600 mt-2">Loading users...</p>
          </div>
        )}

        {/* Table Footer */}
        {filteredUsers.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredUsers.length}</span> of{" "}
              <span className="font-medium">{users.length}</span> users
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
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
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Confirm Deletion
                </h2>
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setCurrentUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                {currentUser
                  ? `Are you sure you want to delete ${currentUser.name}? This action cannot be undone.`
                  : `Are you sure you want to delete ${selectedUsers.length} selected users? This action cannot be undone.`}
              </p>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowDeleteModal(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
                onClick={confirmDelete}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Password Reset Modal */}
      {showPasswordModal && currentUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md">
            <div className="p-6 border-b border-gray-200">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold text-gray-800">
                  Reset Password
                </h2>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setCurrentUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FiX size={20} />
                </button>
              </div>
            </div>
            <div className="p-6">
              <p className="text-gray-600 mb-4">
                Reset password for{" "}
                <span className="font-medium">{currentUser.name}</span>
              </p>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    New Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Enter new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="forceReset"
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    checked={forceReset}
                    onChange={(e) => setForceReset(e.target.checked)}
                  />
                  <label
                    htmlFor="forceReset"
                    className="ml-2 text-sm text-gray-700"
                  >
                    Require password change at next login
                  </label>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 px-6 py-4 rounded-b-xl flex justify-end space-x-3">
              <button
                className="px-4 py-2 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors"
                onClick={() => {
                  setShowPasswordModal(false);
                  setCurrentUser(null);
                }}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                onClick={confirmPasswordReset}
              >
                Reset Password
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
