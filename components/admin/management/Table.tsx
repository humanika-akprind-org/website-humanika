"use client";

import { useRef } from "react";
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
  accessToken,
  onManagementSelect,
  onSelectAll,
  onViewManagement,
  onEditManagement,
  onDeleteManagement,
  onPageChange,
  onAddManagement,
}) => {
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
                    managements.length > 0 &&
                    selectedManagements.length === managements.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Management
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
                Period
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {managements.map((management, index) => (
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
                  <ManagementAvatar
                    management={management}
                    accessToken={accessToken}
                  />
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
                    isLastItem={index === managements.length - 1}
                    hasMultipleItems={managements.length > 1}
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

      {managements.length === 0 && !loading && (
        <EmptyState
          icon={<FiUser size={48} className="mx-auto" />}
          title="No managements found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            <AddButton onClick={handleAddManagement} text="Add Management" />
          }
        />
      )}

      {managements.length > 0 && (
        <Pagination
          usersLength={managements.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}

      {/* Loading Overlay */}
      {loading && (
        <div
          className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50"
          role="status"
          aria-live="polite"
        >
          <div className="bg-white p-6 rounded-lg shadow-xl max-w-sm w-full text-center">
            <div
              className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"
              aria-hidden="true"
            />
            <p className="text-gray-700">Processing your request...</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManagementTable;
