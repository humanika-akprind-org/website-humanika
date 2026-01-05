"use client";

import { useState } from "react";
import { FiEdit, FiTrash2, FiEye, FiTarget } from "react-icons/fi";
import type { WorkProgram } from "@/types/work";
import SortIcon from "../../ui/SortIcon";
import StatusChip from "../../ui/chip/Status";
import Checkbox from "../../ui/checkbox/Checkbox";
import Pagination from "../../ui/pagination/Pagination";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import DropdownMenuItem from "../../ui/dropdown/DropdownMenuItem";
import DropdownMenu from "../../ui/dropdown/DropdownMenu";
import DepartmentChip from "../../ui/chip/Department";
import StatusApprovalChip from "../../ui/chip/StatusApproval";

interface WorkProgramTableProps {
  workPrograms: WorkProgram[];
  selectedPrograms: string[];
  currentPage: number;
  totalPages: number;
  onProgramSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewProgram: (id: string) => void;
  onEditProgram: (id: string) => void;
  onDeleteProgram: (ids?: string[] | undefined) => void;
  onPageChange: (page: number) => void;
  onAddProgram: () => void;
}

export default function WorkProgramTable({
  workPrograms,
  selectedPrograms,
  currentPage,
  totalPages,
  onProgramSelect,
  onSelectAll,
  onViewProgram,
  onEditProgram,
  onDeleteProgram,
  onPageChange,
  onAddProgram,
}: WorkProgramTableProps) {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort programs
  const sortedPrograms = [...workPrograms].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "department":
        aValue = a.department.toLowerCase();
        bValue = b.department.toLowerCase();
        break;
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "responsible":
        aValue = a.responsible?.name?.toLowerCase() || "";
        bValue = b.responsible?.name?.toLowerCase() || "";
        break;
      case "schedule":
        aValue = a.schedule?.toLowerCase() || "";
        bValue = b.schedule?.toLowerCase() || "";
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
                    sortedPrograms.length > 0 &&
                    selectedPrograms.length === sortedPrograms.length
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
                  Program
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
                onClick={() => handleSort("schedule")}
              >
                <div className="flex items-center">
                  Schedule
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="schedule"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("responsible")}
              >
                <div className="flex items-center">
                  Responsible
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="responsible"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("approval")}
              >
                <div className="flex items-center">
                  Approval
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="approval"
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
            {sortedPrograms.map((program) => (
              <tr
                key={program.id}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedPrograms.includes(program.id)}
                    onChange={() => onProgramSelect(program.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900 font-medium">
                    {program.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <DepartmentChip department={program.department} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {program.schedule}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {program.responsible?.name || "Unassigned"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={program.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  {program.approvals && program.approvals.length > 0 ? (
                    (() => {
                      const latestApproval = program.approvals.sort(
                        (a, b) =>
                          new Date(b.updatedAt).getTime() -
                          new Date(a.updatedAt).getTime()
                      )[0];
                      return (
                        <StatusApprovalChip status={latestApproval.status} />
                      );
                    })()
                  ) : (
                    <span className="text-xs text-gray-400">No approvals</span>
                  )}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    isLastItem={false}
                    hasMultipleItems={sortedPrograms.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewProgram(program.id)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditProgram(program.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteProgram([program.id])}
                      color="red"
                    >
                      <FiTrash2 className="mr-2" size={14} />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedPrograms.length === 0 && (
        <EmptyState
          icon={<FiTarget size={48} className="mx-auto" />}
          title="No work programs found"
          description="Try adjusting your search or filter criteria"
          actionButton={<AddButton onClick={onAddProgram} text="Add Program" />}
        />
      )}

      {sortedPrograms.length > 0 && (
        <Pagination
          usersLength={sortedPrograms.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
