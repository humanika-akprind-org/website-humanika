import {
  FiEdit,
  FiTrash2,
  FiKey,
  FiUnlock,
  FiLock,
  FiMail,
  FiX,
} from "react-icons/fi";
import type { User } from "../../../types/user";
import { UserRole } from "../../../types/enums";
import { formatEnumValue } from "@/lib/api/user";

interface UserTableProps {
  users: User[];
  selectedUsers: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onUserSelect: (id: string) => void;
  onSelectAll: () => void;
  onEditUser: (id: string) => void;
  onDeleteUser: (user: User) => void;
  onResetPassword: (user: User) => void;
  onLockAccount: (userId: string) => void;
  onUnlockAccount: (userId: string) => void;
  onPageChange: (page: number) => void;
}

export default function UserTable({
  users,
  selectedUsers,
  loading,
  currentPage,
  totalPages,
  onUserSelect,
  onSelectAll,
  onEditUser,
  onDeleteUser,
  onResetPassword,
  onLockAccount,
  onUnlockAccount,
  onPageChange,
}: UserTableProps) {
  const getStatusClass = (isActive: boolean) =>
    isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";

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
                      onClick={() => onEditUser(user.id)}
                      title="Edit user"
                    >
                      <FiEdit size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                      onClick={() => onDeleteUser(user)}
                      title="Delete user"
                    >
                      <FiTrash2 size={16} />
                    </button>
                    <button
                      className="p-1.5 rounded-lg text-green-600 hover:bg-green-50 transition-colors"
                      onClick={() => onResetPassword(user)}
                      title="Reset password"
                    >
                      <FiKey size={16} />
                    </button>
                    {!user.isActive ? (
                      <button
                        className="p-1.5 rounded-lg text-purple-600 hover:bg-purple-50 transition-colors"
                        onClick={() => onUnlockAccount(user.id)}
                        title="Activate account"
                      >
                        <FiUnlock size={16} />
                      </button>
                    ) : (
                      <button
                        className="p-1.5 rounded-lg text-orange-600 hover:bg-orange-50 transition-colors"
                        onClick={() => onLockAccount(user.id)}
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
          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
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
