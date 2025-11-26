import { FiEye, FiX, FiEdit, FiTrash, FiLock, FiUnlock } from "react-icons/fi";
import type { UserTableProps } from "@/types/user";
import Avatar from "../ui/avatar/Avatar";
import Role from "../ui/chip/user/Role";
import PositionChip from "../ui/chip/user/Position";
import DepartmentChip from "../ui/chip/user/Department";
import UserInfo from "../ui/user/UserInfo";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import ActiveChip from "../ui/chip/user/Active";

export default function UserTable({
  users,
  selectedUsers,
  loading,
  currentPage,
  totalPages,
  onUserSelect,
  onSelectAll,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onLockAccount,
  onUnlockAccount,
  onPageChange,
}: UserTableProps) {
  if (users.length === 0 && !loading) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 mb-2">
          <FiX size={48} className="mx-auto" />
        </div>
        <p className="text-gray-500 text-lg font-medium">No users found</p>
        <p className="text-gray-400 mt-1">
          Try adjusting your search or filter criteria
        </p>
      </div>
    );
  }

  return (
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
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={onSelectAll}
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
                Position
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
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onUserSelect(user.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <Avatar user={user} size="sm" />
                    <UserInfo user={user} />
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <Role role={user.role} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <DepartmentChip department={user.department} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PositionChip position={user.position} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ActiveChip isActive={user.isActive} />
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuItem
                      onClick={() => onViewUser(user.id)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditUser(user.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteUser(user)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                    {!user.isActive ? (
                      <DropdownMenuItem
                        onClick={() => onUnlockAccount(user.id)}
                        color="green"
                      >
                        <FiUnlock className="mr-2" size={14} />
                        Activate account
                      </DropdownMenuItem>
                    ) : (
                      <DropdownMenuItem
                        onClick={() => onLockAccount(user.id)}
                        color="orange"
                      >
                        <FiLock className="mr-2" size={14} />
                        Deactivate account
                      </DropdownMenuItem>
                    )}
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600 mt-2">Loading users...</p>
        </div>
      )}

      {/* Table Footer */}
      {users.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{users.length}</span> users
          </p>
          <div className="flex items-center space-x-1">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>

            {/* Page Numbers */}
            {(() => {
              const pages = [];
              const delta = 2; // Number of pages to show on each side of current page

              // Always show first page
              if (1 < currentPage - delta) {
                pages.push(
                  <button
                    key={1}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => onPageChange(1)}
                  >
                    1
                  </button>
                );
                if (2 < currentPage - delta) {
                  pages.push(
                    <span key="start-ellipsis" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
              }

              // Show pages around current page
              for (
                let i = Math.max(1, currentPage - delta);
                i <= Math.min(totalPages, currentPage + delta);
                i++
              ) {
                pages.push(
                  <button
                    key={i}
                    className={`px-3 py-1.5 text-sm border rounded-md ${
                      i === currentPage
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 text-gray-700 hover:bg-gray-100"
                    }`}
                    onClick={() => onPageChange(i)}
                  >
                    {i}
                  </button>
                );
              }

              // Always show last page
              if (totalPages > currentPage + delta) {
                if (totalPages - 1 > currentPage + delta) {
                  pages.push(
                    <span key="end-ellipsis" className="px-2 text-gray-500">
                      ...
                    </span>
                  );
                }
                pages.push(
                  <button
                    key={totalPages}
                    className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                    onClick={() => onPageChange(totalPages)}
                  >
                    {totalPages}
                  </button>
                );
              }

              return pages;
            })()}

            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
