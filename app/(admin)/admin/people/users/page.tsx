"use client";

import UserStats from "@/components/admin/pages/user/Stats";
import UserFilters from "@/components/admin/pages/user/Filters";
import UserTable from "@/components/admin/pages/user/Table";
import DeleteModal from "@/components/admin/ui/modal/DeleteModal";
import ViewModal from "@/components/admin/ui/modal/ViewModal";
import Loading from "@/components/admin/layout/loading/Loading";
import Alert, { type AlertType } from "@/components/admin/ui/alert/Alert";
import ManagementHeader from "@/components/admin/ui/ManagementHeader";
import AddButton from "@/components/admin/ui/button/AddButton";
import Avatar from "@/components/admin/ui/avatar/Avatar";
import Role from "@/components/admin/ui/chip/Role";
import DepartmentChip from "@/components/admin/ui/chip/Department";
import PositionChip from "@/components/admin/ui/chip/Position";
import ActiveChip from "@/components/admin/ui/chip/Active";
import DateDisplay from "@/components/admin/ui/date/DateDisplay";
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
        itemName={currentUser?.name}
        selectedCount={selectedUsers.length}
        onClose={() => {
          setShowDeleteModal(false);
          setCurrentUser(null);
        }}
        onConfirm={confirmDelete}
      />

      <ViewModal
        isOpen={showViewModal}
        title="User Details"
        onClose={() => {
          setShowViewModal(false);
          setCurrentUser(null);
        }}
      >
        {currentUser && (
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <Avatar user={currentUser} size="lg" />
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {currentUser.name}
                </h4>
                <p className="text-gray-600">@{currentUser.username}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.email}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Role
                </label>
                <div className="mt-1">
                  <Role role={currentUser.role} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Department
                </label>
                <div className="mt-1">
                  {currentUser.department ? (
                    <DepartmentChip department={currentUser.department} />
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Position
                </label>
                <div className="mt-1">
                  {currentUser.position ? (
                    <PositionChip position={currentUser.position} />
                  ) : (
                    <span className="text-gray-500">Not assigned</span>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Status
                </label>
                <div className="mt-1">
                  <ActiveChip isActive={currentUser.isActive} />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Account Verified
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.verifiedAccount ? "Yes" : "No"}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Login Attempts
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  {currentUser.attemptLogin}
                </p>
              </div>

              {currentUser.blockExpires && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Block Expires
                  </label>
                  <p className="mt-1 text-sm text-gray-900">
                    <DateDisplay date={currentUser.blockExpires} />
                  </p>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Created At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentUser.createdAt} />
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Updated At
                </label>
                <p className="mt-1 text-sm text-gray-900">
                  <DateDisplay date={currentUser.updatedAt} />
                </p>
              </div>
            </div>
          </div>
        )}
      </ViewModal>
    </div>
  );
}
