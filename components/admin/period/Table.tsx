"use client";

import { useRef } from "react";
import { FiEye, FiEdit, FiTrash2, FiCalendar } from "react-icons/fi";
import type { Period } from "@/types/period";
import ActiveChip from "../ui/chip/Active";
import Checkbox from "../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import Pagination from "../ui/pagination/Pagination";
import EmptyState from "../ui/EmptyState";
import SortIcon from "../ui/SortIcon";
interface PeriodTableProps {
  periods: Period[];
  selectedPeriods: string[];
  onSelectPeriod: (id: string) => void;
  onSelectAll: () => void;
  onViewPeriod: (period: Period) => void;
  onEditPeriod: (period: Period) => void;
  onDelete: (period?: Period) => void;
  sortField: string;
  sortDirection: "asc" | "desc";
  onSort: (field: string) => void;
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export default function PeriodTable({
  periods,
  selectedPeriods,
  onSelectPeriod,
  onSelectAll,
  onViewPeriod,
  onEditPeriod,
  onDelete,
  sortField,
  sortDirection,
  onSort,
  currentPage,
  totalPages,
  onPageChange,
}: PeriodTableProps) {
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
                    periods.length > 0 &&
                    selectedPeriods.length === periods.length
                  }
                  onChange={onSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => onSort("name")}
              >
                <div className="flex items-center">
                  Nama Period
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="name"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Start Year
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                End Year
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
            {periods.map((period, index) => (
              <tr
                key={period.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedPeriods.includes(period.id)}
                    onChange={() => onSelectPeriod(period.id)}
                  />
                </td>
                <td className="px-4 py-4">
                  <div className="text-sm font-medium text-gray-900">
                    {period.name}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">
                    {period.startYear}
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{period.endYear}</div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ActiveChip isActive={period.isActive} />
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === periods.length - 1}
                    hasMultipleItems={periods.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewPeriod(period)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onEditPeriod(period)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDelete(period)}
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

      {periods.length === 0 && (
        <EmptyState
          icon={<FiCalendar size={48} className="mx-auto" />}
          title="No periods found"
          description="Try adjusting your search or filter criteria"
        />
      )}

      {periods.length > 0 && (
        <Pagination
          usersLength={periods.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
