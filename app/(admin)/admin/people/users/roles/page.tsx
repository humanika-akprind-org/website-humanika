"use client";

import { useState, useEffect, useCallback } from "react";
import type { UserRole, Department } from "@/types/enums";
import type { User } from "@/types/user";
import { UserApi } from "@/use-cases/api/user";
import Stats from "@/components/admin/user/roles/Stats";
import Filters from "@/components/admin/user/roles/Filters";
import Table from "@/components/admin/user/roles/Table";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import VerifyButton from "@/components/admin/ui/button/VerifyButton";

export default function VerifyAccountsPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
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
      setAlert(null);
      const response = await UserApi.getUnverifiedUsers({
        search: searchTerm,
        role: filters.role || undefined,
        department: filters.department || undefined,
        page: currentPage,
        limit: 10,
      });

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else if (response.data) {
        setUsers(response.data.users);
        setTotalPages(response.data.pagination.pages);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to fetch unverified users" });
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
        setAlert({ type: "error", message: response.error });
      } else {
        setAlert({ type: "success", message: "User verified successfully" });
        // Remove the user from the list
        setUsers(users.filter((user) => user.id !== userId));
        setSelectedUsers(selectedUsers.filter((id) => id !== userId));
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to verify user" });
    } finally {
      setProcessingIds(processingIds.filter((id) => id !== userId));
      setTimeout(() => setAlert(null), 3000);
    }
  };

  // Bulk verify users
  const handleBulkVerify = async () => {
    if (selectedUsers.length === 0) return;

    try {
      setProcessingIds([...processingIds, ...selectedUsers]);
      const response = await UserApi.bulkVerifyUsers(selectedUsers);

      if (response.error) {
        setAlert({ type: "error", message: response.error });
      } else if (response.data) {
        setAlert({
          type: "success",
          message: `${response.data.count} users verified successfully`,
        });
        // Remove verified users from the list
        setUsers(users.filter((user) => !selectedUsers.includes(user.id)));
        setSelectedUsers([]);
      }
    } catch (_error) {
      setAlert({ type: "error", message: "Failed to verify users" });
    } finally {
      setProcessingIds(
        processingIds.filter((id) => !selectedUsers.includes(id))
      );
      setTimeout(() => setAlert(null), 3000);
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

  if (loading) {
    return <Loading />;
  }

  return (
    <div>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <ManagementHeader
          title="Account Verification"
          description="Manage unverified user accounts and send verification emails"
        />
        <div className="flex space-x-2 mt-4 md:mt-0">
          <VerifyButton
            onClick={handleBulkVerify}
            selectedCount={selectedUsers.length}
            disabled={selectedUsers.length === 0 || processingIds.length > 0}
          />
        </div>
      </div>

      {/* Stats Overview */}
      <Stats
        unverifiedUsersCount={users.length}
        selectedUsersCount={selectedUsers.length}
        processingCount={processingIds.length}
      />

      {/* Alert Message */}
      {alert && <Alert type={alert.type} message={alert.message} />}

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
        onVerifyUser={handleVerifyUser}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
