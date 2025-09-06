"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiPlus } from "react-icons/fi";
import UserStats from "@/components/admin/user/Stats";
import UserFilters from "@/components/admin/user/Filters";
import UserTable from "@/components/admin/user/Table";
import DeleteModal from "@/components/admin/user/modal/DeleteModal";
import PasswordResetModal from "@/components/admin/user/modal/PasswordResetModal";
import { UserApi } from "@/lib/api/user";
import type { User, UserFilters as UserFiltersType } from "@/types/user";

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
  const [filters, setFilters] = useState<UserFiltersType>({
    role: "",
    department: "",
    isActive: "",
  });
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [forceReset, setForceReset] = useState(false);

  const fetchUsers = useCallback(async () => {
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
  }, [searchTerm, currentPage, filters.role, filters.department, filters.isActive]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const toggleUserSelection = (id: string) => {
    if (selectedUsers.includes(id)) {
      setSelectedUsers(selectedUsers.filter((userId) => userId !== id));
    } else {
      setSelectedUsers([...selectedUsers, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedUsers.length === users.length) {
      setSelectedUsers([]);
    } else {
      setSelectedUsers(users.map((user) => user.id));
    }
  };

  const handleAddUser = () => {
    router.push("/admin/people/users/add");
  };

  const handleEditUser = (id: string) => {
    router.push(`/admin/people/users/edit/${id}`);
  };

  const handleDelete = (user?: User) => {
    if (user) {
      setCurrentUser(user);
    }
    setShowDeleteModal(true);
  };

  const handleResetPassword = (user: User) => {
    setCurrentUser(user);
    setNewPassword("");
    setConfirmPassword("");
    setForceReset(false);
    setShowPasswordModal(true);
  };

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

  const confirmDelete = async () => {
    try {
      if (currentUser) {
        const response = await UserApi.deleteUser(currentUser.id);
        if (response.error) {
          setError(response.error);
        } else {
          setSuccess("User deleted successfully");
          fetchUsers();
        }
      } else if (selectedUsers.length > 0) {
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

  const confirmPasswordReset = () => {
    if (newPassword !== confirmPassword) {
      setError("Passwords don't match!");
      return;
    }

    console.log(`Password reset for ${currentUser?.name} to: ${newPassword}`);
    console.log(`Force reset on next login: ${forceReset}`);

    setShowPasswordModal(false);
    setCurrentUser(null);
    setNewPassword("");
    setConfirmPassword("");
    setSuccess("Password reset successfully");
    setTimeout(() => setSuccess(""), 3000);
  };

  const handleFilterChange = (key: keyof UserFiltersType, value: string) => {
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

      <UserStats users={users} />

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

      <UserFilters
        filters={filters}
        searchTerm={searchTerm}
        selectedUsers={selectedUsers}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        onDeleteSelected={() => handleDelete()}
      />

      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onUserSelect={toggleUserSelection}
        onSelectAll={toggleSelectAll}
        onEditUser={handleEditUser}
        onDeleteUser={handleDelete}
        onResetPassword={handleResetPassword}
        onLockAccount={handleLockAccount}
        onUnlockAccount={handleUnlockAccount}
        onPageChange={setCurrentPage}
      />

      <DeleteModal
        isOpen={showDeleteModal}
        user={currentUser}
        selectedCount={selectedUsers.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentUser(null);
        }}
        onConfirm={confirmDelete}
      />

      <PasswordResetModal
        isOpen={showPasswordModal}
        user={currentUser}
        newPassword={newPassword}
        confirmPassword={confirmPassword}
        forceReset={forceReset}
        onClose={() => {
          setShowPasswordModal(false);
          setCurrentUser(null);
        }}
        onPasswordChange={setNewPassword}
        onConfirmPasswordChange={setConfirmPassword}
        onForceResetChange={setForceReset}
        onConfirm={confirmPasswordReset}
      />
    </div>
  );
}
