// app/(admin)/admin/people/users/verify-accounts/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  // FiSend,
  FiCheckCircle,
} from "react-icons/fi";

import type { UserRole, Department } from "@/types/enums";
import type { User } from "@/types/user";
import { UserApi } from "@/use-cases/api/user";
import Stats from "@/components/admin/user/roles/Stats";
import Filters from "@/components/admin/user/roles/Filters";
import Table from "@/components/admin/user/roles/Table";

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

  const fetchUsers = useCallback(async () => {
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
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (_error) {
      setError("Failed to fetch unverified users");
    } finally {
      setLoading(false);
    }
  }, [searchTerm, currentPage, filters]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

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
  // const handleSendVerification = async (userId: string) => {
  //   try {
  //     setProcessingIds([...processingIds, userId]);
  //     const response = await UserApi.sendVerificationEmail(userId);

  //     if (response.error) {
  //       setError(response.error);
  //     } else {
  //       setSuccess("Verification email sent successfully");
  //     }
  //   } catch (_error) {
  //     setError("Failed to send verification email");
  //   } finally {
  //     setProcessingIds(processingIds.filter((id) => id !== userId));
  //     setTimeout(() => setSuccess(""), 3000);
  //   }
  // };

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
  // const handleBulkSendVerification = async () => {
  //   if (selectedUsers.length === 0) return;

  //   try {
  //     setProcessingIds([...processingIds, ...selectedUsers]);
  //     const response = await UserApi.bulkSendVerification(selectedUsers);

  //     if (response.error) {
  //       setError(response.error);
  //     } else if (response.data) {
  //       setSuccess(`Verification emails sent to ${response.data.count} users`);
  //     }
  //   } catch (_error) {
  //     setError("Failed to send verification emails");
  //   } finally {
  //     setProcessingIds(
  //       processingIds.filter((id) => !selectedUsers.includes(id))
  //     );
  //     setTimeout(() => setSuccess(""), 3000);
  //   }
  // };

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  const clearFilters = () => {
    setFilters({ role: "", department: "" });
    setSearchTerm("");
    setCurrentPage(1);
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
          {/* <button
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center disabled:opacity-50"
            onClick={handleBulkSendVerification}
            disabled={selectedUsers.length === 0 || processingIds.length > 0}
          >
            <FiSend className="mr-2" />
            Send Verification ({selectedUsers.length})
          </button> */}
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
      <Stats
        unverifiedUsersCount={users.length}
        selectedUsersCount={selectedUsers.length}
        processingCount={processingIds.length}
      />

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
      <Filters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        filters={filters}
        onFilterChange={handleFilterChange}
        isFilterOpen={isFilterOpen}
        onToggleFilter={() => setIsFilterOpen(!isFilterOpen)}
        onClearFilters={clearFilters}
      />

      {/* Users Table */}
      <Table
        users={filteredUsers}
        selectedUsers={selectedUsers}
        processingIds={processingIds}
        onToggleUserSelection={toggleUserSelection}
        onToggleSelectAll={toggleSelectAll}
        // onSendVerification={handleSendVerification}
        onVerifyUser={handleVerifyUser}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
