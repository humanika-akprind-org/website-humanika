import { FiEye, FiX, FiEdit, FiTrash, FiLock, FiUnlock } from "react-icons/fi";
import type { UserTableProps } from "@/types/user";
import Avatar from "../ui/avatar/Avatar";
import Role from "../ui/chip/Role";
import PositionChip from "../ui/chip/Position";
import DepartmentChip from "../ui/chip/Department";
import UserInfo from "../ui/dropdown/UserInfo";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import ActiveChip from "../ui/chip/Active";
import Checkbox from "../ui/checkbox/Checkbox";
import Pagination from "../ui/pagination/Pagination";

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
                <Checkbox
                  checked={
                    users.length > 0 && selectedUsers.length === users.length
                  }
                  onChange={onSelectAll}
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
                  <Checkbox
                    checked={selectedUsers.includes(user.id)}
                    onChange={() => onUserSelect(user.id)}
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

      {users.length > 0 && (
        <Pagination
          usersLength={users.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
