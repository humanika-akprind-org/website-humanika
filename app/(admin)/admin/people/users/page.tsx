// app/dashboard/user/page.tsx
"use client";

import { useState } from "react";
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

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "locked";
  lastLogin: string;
  department: string;
  avatarColor: string;
}

export default function UserAllPage() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@organization.org",
      role: "Administrator",
      status: "active",
      lastLogin: "2023-10-15 09:32:45",
      department: "IT",
      avatarColor: "bg-blue-500",
    },
    {
      id: 2,
      name: "Alice Smith",
      email: "alice.smith@organization.org",
      role: "Editor",
      status: "active",
      lastLogin: "2023-10-18 14:20:12",
      department: "Marketing",
      avatarColor: "bg-pink-500",
    },
    {
      id: 3,
      name: "Robert Johnson",
      email: "robert.j@organization.org",
      role: "Viewer",
      status: "locked",
      lastLogin: "2023-10-05 11:45:23",
      department: "Finance",
      avatarColor: "bg-purple-500",
    },
    {
      id: 4,
      name: "Emily Wilson",
      email: "emily.wilson@organization.org",
      role: "Manager",
      status: "inactive",
      lastLogin: "2023-09-28 16:30:55",
      department: "HR",
      avatarColor: "bg-green-500",
    },
    {
      id: 5,
      name: "Michael Brown",
      email: "michael.b@organization.org",
      role: "Editor",
      status: "active",
      lastLogin: "2023-10-19 08:12:37",
      department: "Operations",
      avatarColor: "bg-yellow-500",
    },
    {
      id: 6,
      name: "Sarah Davis",
      email: "sarah.d@organization.org",
      role: "Viewer",
      status: "active",
      lastLogin: "2023-10-20 10:35:21",
      department: "IT",
      avatarColor: "bg-red-500",
    },
    {
      id: 7,
      name: "David Miller",
      email: "david.m@organization.org",
      role: "Manager",
      status: "inactive",
      lastLogin: "2023-10-12 13:42:18",
      department: "Operations",
      avatarColor: "bg-indigo-500",
    },
    {
      id: 8,
      name: "Lisa Anderson",
      email: "lisa.a@organization.org",
      role: "Editor",
      status: "active",
      lastLogin: "2023-10-19 16:20:05",
      department: "Marketing",
      avatarColor: "bg-teal-500",
    },
  ]);

  const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [roleFilter, setRoleFilter] = useState("all");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forceReset, setForceReset] = useState(false);

  // Filter users based on search term and filters
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || user.status === statusFilter;
    const matchesRole = roleFilter === "all" || user.role === roleFilter;

    return matchesSearch && matchesStatus && matchesRole;
  });

  // Toggle user selection
  const toggleUserSelection = (id: number) => {
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
  const handleEditUser = (id: number) => {
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
  const handleLockAccount = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "locked" } : user
      )
    );
  };

  // Unlock account
  const handleUnlockAccount = (userId: number) => {
    setUsers(
      users.map((user) =>
        user.id === userId ? { ...user, status: "active" } : user
      )
    );
  };

  // Change user status
  const handleChangeStatus = (
    userId: number,
    status: "active" | "inactive"
  ) => {
    setUsers(
      users.map((user) => (user.id === userId ? { ...user, status } : user))
    );
  };

  // Execute deletion
  const confirmDelete = () => {
    if (currentUser) {
      // Delete single user
      setUsers(users.filter((user) => user.id !== currentUser.id));
    } else if (selectedUsers.length > 0) {
      // Delete multiple users
      setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
      setSelectedUsers([]);
    }
    setShowDeleteModal(false);
    setCurrentUser(null);
  };

  // Execute password reset
  const confirmPasswordReset = () => {
    if (newPassword !== confirmPassword) {
      alert("Passwords don't match!");
      return;
    }

    // Here you would typically make an API call to reset the password
    console.log(`Password reset for ${currentUser?.name} to: ${newPassword}`);
    console.log(`Force reset on next login: ${forceReset}`);

    setShowPasswordModal(false);
    setCurrentUser(null);
    setNewPassword("");
    setConfirmPassword("");
  };

  // Get status badge class
  const getStatusClass = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-yellow-100 text-yellow-800";
      case "locked":
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

  // Format last login date
  const formatLastLogin = (dateString: string) => {
    const date = new Date(dateString);
    return (
      date.toLocaleDateString() +
      " " +
      date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    );
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
            {users.filter((u) => u.status === "active").length}
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
            {users.filter((u) => u.status === "inactive").length}
          </p>
        </div>
        <div className="bg-white rounded-xl shadow-sm p-4 border border-gray-100">
          <div className="flex justify-between items-center">
            <h3 className="text-sm font-medium text-gray-600">
              Locked Accounts
            </h3>
            <div className="p-2 bg-red-100 rounded-lg">
              <FiLock className="text-red-500" />
            </div>
          </div>
          <p className="text-2xl font-bold text-gray-800 mt-2">
            {users.filter((u) => u.status === "locked").length}
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
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="locked">Locked</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Role
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
                  Last Login
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
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getRoleClass(
                        user.role
                      )}`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                    {user.department}
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
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                    {formatLastLogin(user.lastLogin)}
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
                      {user.status === "locked" ? (
                        <button
                          className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                          onClick={() => handleUnlockAccount(user.id)}
                          title="Unlock account"
                        >
                          <FiUnlock size={16} />
                        </button>
                      ) : (
                        <button
                          className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                          onClick={() => handleLockAccount(user.id)}
                          title="Lock account"
                        >
                          <FiLock size={16} />
                        </button>
                      )}
                      {user.status !== "locked" && (
                        <button
                          className="p-1.5 rounded-lg text-yellow-600 hover:bg-yellow-50 transition-colors"
                          onClick={() =>
                            handleChangeStatus(
                              user.id,
                              user.status === "active" ? "inactive" : "active"
                            )
                          }
                          title={
                            user.status === "active"
                              ? "Deactivate account"
                              : "Activate account"
                          }
                        >
                          {user.status === "active" ? (
                            <FiUserX size={16} />
                          ) : (
                            <FiUserCheck size={16} />
                          )}
                        </button>
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
              <FiUsers size={48} className="mx-auto" />
            </div>
            <p className="text-gray-500 text-lg font-medium">No users found</p>
            <p className="text-gray-400 mt-1">
              Try adjusting your search or filter criteria
            </p>
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
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
                Previous
              </button>
              <button className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100">
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
