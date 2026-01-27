"use client";

import { useState } from "react";
import UserStats from "@/src/presentation/components/admin/pages/user/roles/Stats";
import UserFilters from "@/src/presentation/components/admin/pages/user/roles/Filters";
import UserTable from "@/src/presentation/components/admin/pages/user/roles/Table";
import Loading from "@/src/presentation/components/admin/layout/loading/Loading";
import Alert, {
  type AlertType,
} from "@/src/presentation/components/admin/ui/alert/Alert";
import ManagementHeader from "@/src/presentation/components/admin/ui/ManagementHeader";
import VerifyButton from "@/src/presentation/components/admin/ui/button/VerifyButton";
import { useUnverifiedUserManagement } from "@/src/presentation/hooks/user/useUnverifiedUserManagement";

export default function UsersPage() {
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const {
    users,
    loading,
    error,
    success,
    selectedUsers,
    searchTerm,
    currentPage,
    totalPages,
    filters,
    setSearchTerm,
    setCurrentPage,
    toggleUserSelection,
    toggleSelectAll,
    handleViewUser,
    handleAddUser,
    handleEditUser,
    handleDelete,
    handleLockAccount,
    handleUnlockAccount,
    handleFilterChange,
    handleVerify,
    handleVerifyUser,
  } = useUnverifiedUserManagement();

  const handleToggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const handleClearFilters = () => {
    handleFilterChange("role", "all");
    handleFilterChange("department", "all");
    handleFilterChange("isActive", "all");
  };

  const alert: { type: AlertType; message: string } | null = error
    ? { type: "error", message: error }
    : success
      ? { type: "success", message: success }
      : null;

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
        <div className="flex gap-2">
          <VerifyButton
            onClick={handleVerify}
            selectedCount={selectedUsers.length}
            disabled={selectedUsers.length === 0}
          />
        </div>
      </div>

      <UserStats users={users} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      <UserFilters
        filters={filters}
        searchTerm={searchTerm}
        onFilterChange={handleFilterChange}
        onSearchChange={setSearchTerm}
        isFilterOpen={isFilterOpen}
        onToggleFilter={handleToggleFilter}
        onClearFilters={handleClearFilters}
      />

      <UserTable
        users={users}
        selectedUsers={selectedUsers}
        loading={loading}
        currentPage={currentPage}
        totalPages={totalPages}
        onUserSelect={toggleUserSelection}
        onSelectAll={toggleSelectAll}
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDelete}
        onLockAccount={handleLockAccount}
        onUnlockAccount={handleUnlockAccount}
        onPageChange={setCurrentPage}
        onAddUser={handleAddUser}
        onVerifyUser={handleVerifyUser}
      />
    </div>
  );
}
