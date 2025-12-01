"use client";

import UserStats from "@/components/admin/user/Stats";
import UserFilters from "@/components/admin/user/Filters";
import UserTable from "@/components/admin/user/Table";
import DeleteModal from "@/components/admin/user/modal/DeleteModal";
import ViewUserModal from "@/components/admin/user/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import { useUserManagement } from "@/hooks/user/useUserManagement";

export default function UsersPage() {
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
    showDeleteModal,
    showViewModal,
    currentUser,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentUser,
    toggleUserSelection,
    toggleSelectAll,
    handleViewUser,
    handleAddUser,
    handleEditUser,
    handleDelete,
    handleLockAccount,
    handleUnlockAccount,
    confirmDelete,
    handleFilterChange,
  } = useUserManagement();

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
          title="User Management"
          description="Manage all system users and their permissions"
        />
        <AddButton onClick={handleAddUser} text="Add User" />
      </div>

      <UserStats users={users} />

      {alert && <Alert type={alert.type} message={alert.message} />}

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
        onViewUser={handleViewUser}
        onEditUser={handleEditUser}
        onDeleteUser={handleDelete}
        onLockAccount={handleLockAccount}
        onUnlockAccount={handleUnlockAccount}
        onPageChange={setCurrentPage}
        onAddUser={handleAddUser}
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

      <ViewUserModal
        isOpen={showViewModal}
        user={currentUser}
        onClose={() => {
          setShowViewModal(false);
          setCurrentUser(null);
        }}
      />
    </div>
  );
}
