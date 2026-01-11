import { useRef, useState } from "react";
import {
  FiEye,
  FiEdit,
  FiTrash,
  FiLock,
  FiUnlock,
  FiUser,
} from "react-icons/fi";
import type { UserTableProps } from "@/types/user";
import Avatar from "../../ui/avatar/Avatar";
import Role from "../../ui/chip/Role";
import PositionChip from "../../ui/chip/Position";
import DepartmentChip from "../../ui/chip/Department";
import UserInfo from "../../ui/dropdown/UserInfo";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import ActiveChip from "../../ui/chip/Active";
import Checkbox from "../../ui/checkbox/Checkbox";
import Pagination from "../../ui/pagination/Pagination";
import AddButton from "../../ui/button/AddButton";
import EmptyState from "../../ui/EmptyState";
import SortIcon from "../../ui/SortIcon";

export default function UserTable({
  users,
  selectedUsers,
  loading,
  currentPage,
  totalPages,
  currentUserId,
  onUserSelect,
  onSelectAll,
  onViewUser,
  onEditUser,
  onDeleteUser,
  onLockAccount,
  onUnlockAccount,
  onPageChange,
  onAddUser,
}: UserTableProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Filter out current user
  const filteredUsers = currentUserId
    ? users.filter((user) => user.id !== currentUserId)
    : users;

  // Sort users
  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "role":
        aValue = a.role.toLowerCase();
        bValue = b.role.toLowerCase();
        break;
      case "department":
        aValue = a.department?.toLowerCase() || "";
        bValue = b.department?.toLowerCase() || "";
        break;
      case "position":
        aValue = a.position?.toLowerCase() || "";
        bValue = b.position?.toLowerCase() || "";
        break;
      case "status":
        aValue = a.isActive ? "active" : "inactive";
        bValue = b.isActive ? "active" : "inactive";
        break;
      default:
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
    }

    if (aValue < bValue) return sortDirection === "asc" ? -1 : 1;
    if (aValue > bValue) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });

  // Handle sort
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const rowRefs = useRef<(HTMLTableRowElement | null)[]>([]);
  return (
    <div className="bg-white rounded-xl shadow-sm overflow-visible border border-gray-100">
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
                    sortedUsers.length > 0 &&
                    selectedUsers.length === sortedUsers.length
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  User
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="name"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("role")}
              >
                <div className="flex items-center">
                  Role
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="role"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("department")}
              >
                <div className="flex items-center">
                  Department
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="department"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("position")}
              >
                <div className="flex items-center">
                  Position
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="position"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("status")}
              >
                <div className="flex items-center">
                  Status
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="status"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedUsers.map((user, index) => (
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
                    isLastItem={index === sortedUsers.length - 1}
                    hasMultipleItems={sortedUsers.length > 1}
                  >
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

      {sortedUsers.length === 0 && !loading && (
        <EmptyState
          icon={<FiUser size={48} className="mx-auto" />}
          title="No users found"
          description="Try adjusting your search or filter criteria"
          actionButton={<AddButton onClick={onAddUser} text="Add User" />}
        />
      )}

      {sortedUsers.length > 0 && (
        <Pagination
          usersLength={sortedUsers.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
