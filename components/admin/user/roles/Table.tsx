import React, { useRef } from "react";
import { FiCheckCircle, FiCheck } from "react-icons/fi";
import type { UserTableProps } from "@/types/user";
import Avatar from "../../ui/avatar/Avatar";
import Role from "../../ui/chip/Role";
import PositionChip from "../../ui/chip/Position";
import DepartmentChip from "../../ui/chip/Department";
import UserInfo from "../../ui/dropdown/UserInfo";
import ActiveChip from "../../ui/chip/Active";
import Checkbox from "../../ui/checkbox/Checkbox";
import Pagination from "../../ui/pagination/Pagination";
import EmptyState from "../../ui/EmptyState";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";

export default function UserTable({
  users,
  selectedUsers,
  loading,
  currentPage,
  currentUserId,
  totalPages,
  onUserSelect,
  onSelectAll,
  onPageChange,
  onVerifyUser,
}: UserTableProps & { onVerifyUser: (userId: string) => void }) {
  const unverifiedUsers = users.filter((user) => !user.verifiedAccount);

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);

  // Filter users to exclude unverified users and current user
  const filteredUsers = users.filter(
    (user) => user.verifiedAccount && user.id !== currentUserId
  );

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
                    unverifiedUsers.length > 0 &&
                    selectedUsers.length === unverifiedUsers.length
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
            {unverifiedUsers.map((user, index) => (
              <tr
                key={user.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
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
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === filteredUsers.length - 1}
                    hasMultipleItems={filteredUsers.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onVerifyUser(user.id)}
                      color="green"
                    >
                      <FiCheck className="mr-2" size={14} />
                      Verify User
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {unverifiedUsers.length === 0 && !loading && (
        <EmptyState
          icon={<FiCheckCircle size={48} className="mx-auto" />}
          title="No unverified users found"
          description="All accounts are verified"
        />
      )}

      {unverifiedUsers.length > 0 && (
        <Pagination
          usersLength={unverifiedUsers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
