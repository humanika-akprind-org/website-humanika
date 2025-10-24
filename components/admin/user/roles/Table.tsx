import {
  FiMail,
  // FiSend,
  FiCheckCircle,
} from "react-icons/fi";
import type { User } from "@/types/user";

interface TableProps {
  users: User[];
  selectedUsers: string[];
  processingIds: string[];
  onToggleUserSelection: (id: string) => void;
  onToggleSelectAll: () => void;
  // onSendVerification: (userId: string) => void;
  onVerifyUser: (userId: string) => void;
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function Table({
  users,
  selectedUsers,
  processingIds,
  onToggleUserSelection,
  onToggleSelectAll,
  // onSendVerification,
  onVerifyUser,
  loading,
  currentPage,
  totalPages,
  onPageChange,
}: TableProps) {
  // Format date
  const formatDate = (date: Date | string) => {
    const dateObj = typeof date === "string" ? new Date(date) : date;
    return (
      dateObj.toLocaleDateString() +
      " " +
      dateObj.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })
    );
  };

  // Format enum values for display
  const formatEnumValue = (value: string) =>
    value
      .toLowerCase()
      .replace(/_/g, " ")
      .replace(/\b\w/g, (l) => l.toUpperCase());

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
                  onChange={onToggleSelectAll}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  disabled={processingIds.length > 0}
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
                    onChange={() => onToggleUserSelection(user.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                    disabled={processingIds.includes(user.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="flex items-center">
                    <div
                      className="flex-shrink-0 rounded-full overflow-hidden"
                      style={{ backgroundColor: user.avatarColor }}
                    >
                      <span className="w-10 h-10 flex items-center justify-center text-white font-semibold text-sm">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .toUpperCase()
                          .slice(0, 2)}
                      </span>
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
                  <span className="px-2.5 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-800">
                    {formatEnumValue(user.role)}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {user.department ? formatEnumValue(user.department) : "-"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      user.isActive
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {user.isActive ? "Active" : "Inactive"}
                  </span>
                  {!user.verifiedAccount && (
                    <span className="ml-2 px-2.5 py-0.5 text-xs font-medium rounded-full bg-yellow-100 text-yellow-800">
                      Unverified
                    </span>
                  )}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(user.createdAt)}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {/* <button
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onSendVerification(user.id)}
                      disabled={processingIds.includes(user.id)}
                      title="Send verification email"
                    >
                      {processingIds.includes(user.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2" />
                      ) : (
                        <FiSend className="mr-2" size={14} />
                      )}
                      Send
                    </button> */}
                    <button
                      className="inline-flex items-center px-3 py-1.5 text-sm font-medium rounded-md text-green-700 bg-green-50 hover:bg-green-100 border border-green-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      onClick={() => onVerifyUser(user.id)}
                      disabled={processingIds.includes(user.id)}
                      title="Verify account"
                    >
                      {processingIds.includes(user.id) ? (
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2" />
                      ) : (
                        <FiCheckCircle className="mr-2" size={14} />
                      )}
                      Verify
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {users.length === 0 && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 mb-2">
            <FiCheckCircle size={48} className="mx-auto" />
          </div>
          <p className="text-gray-500 text-lg font-medium">
            All accounts are verified
          </p>
          <p className="text-gray-400 mt-1">No unverified accounts found</p>
        </div>
      )}

      {loading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto" />
          <p className="text-gray-600 mt-2">Loading unverified users...</p>
        </div>
      )}

      {/* Table Footer */}
      {users.length > 0 && (
        <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
          <p className="text-sm text-gray-700 mb-4 sm:mb-0">
            Showing <span className="font-medium">{users.length}</span> of{" "}
            <span className="font-medium">{users.length}</span> unverified users
          </p>
          <div className="flex space-x-2">
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1 || processingIds.length > 0}
            >
              Previous
            </button>
            <button
              className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages || processingIds.length > 0}
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
