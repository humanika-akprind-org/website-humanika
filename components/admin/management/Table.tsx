"use client";

import { useRef, useState } from "react";
import { FiEye, FiEdit, FiTrash, FiUser } from "react-icons/fi";
import type { Management } from "@/types/management";
import ManagementAvatar from "../ui/avatar/ManagementAvatar";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import DepartmentChip from "../ui/chip/Department";
import PositionChip from "../ui/chip/Position";
import Checkbox from "../ui/checkbox/Checkbox";
import Pagination from "../ui/pagination/Pagination";
import AddButton from "../ui/button/AddButton";
import EmptyState from "../ui/EmptyState";
import SortIcon from "../ui/SortIcon";

interface ManagementTableProps {
  managements: Management[];
  selectedManagements: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  accessToken?: string;
  onManagementSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewManagement: (id: string) => void;
  onEditManagement: (id: string) => void;
  onDeleteManagement: (management?: Management) => void;
  onPageChange: (page: number) => void;
  onAddManagement: () => void;
}

const ManagementTable: React.FC<ManagementTableProps> = ({
  managements,
  selectedManagements,
  loading,
  currentPage,
  totalPages,
  onManagementSelect,
  onSelectAll,
  onViewManagement,
  onEditManagement,
  onDeleteManagement,
  onPageChange,
  onAddManagement,
}) => {
  const [sortField, setSortField] = useState("management");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort managements
  const sortedManagements = [...managements].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "photo":
        aValue = a.user?.name?.toLowerCase() || "";
        bValue = b.user?.name?.toLowerCase() || "";
        break;
      case "department":
        aValue = a.department?.toLowerCase() || "";
        bValue = b.department?.toLowerCase() || "";
        break;
      case "position":
        aValue = a.position?.toLowerCase() || "";
        bValue = b.position?.toLowerCase() || "";
        break;
      case "period":
        aValue = a.period?.name?.toLowerCase() || "";
        bValue = b.period?.name?.toLowerCase() || "";
        break;
      default:
        aValue = a.user?.name?.toLowerCase() || "";
        bValue = b.user?.name?.toLowerCase() || "";
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

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleManagementSelect = (id: string) => {
    onManagementSelect(id);
  };

  const handleViewManagement = (id: string) => {
    onViewManagement(id);
  };

  const handleEditManagement = (id: string) => {
    onEditManagement(id);
  };

  const handleAddManagement = () => {
    onAddManagement();
  };

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
                    sortedManagements.length > 0 &&
                    selectedManagements.length === sortedManagements.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("photo")}
              >
                <div className="flex items-center">
                  Photo
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="photo"
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
                onClick={() => handleSort("period")}
              >
                <div className="flex items-center">
                  Period
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="period"
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
            {sortedManagements.map((management, index) => (
              <tr
                key={management.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedManagements.includes(management.id)}
                    onChange={() => handleManagementSelect(management.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ManagementAvatar management={management} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <DepartmentChip department={management.department} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <PositionChip position={management.position} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {management.period?.name || "Unknown Period"}
                  </div>
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedManagements.length - 1}
                    hasMultipleItems={sortedManagements.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => handleViewManagement(management.id)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditManagement(management.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteManagement(management)}
                      color="red"
                    >
                      <FiTrash className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedManagements.length === 0 && !loading && (
        <EmptyState
          icon={<FiUser size={48} className="mx-auto" />}
          title="No managements found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddManagement} text="Add Management" />
          }
        />
      )}

      {sortedManagements.length > 0 && (
        <Pagination
          usersLength={sortedManagements.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default ManagementTable;
