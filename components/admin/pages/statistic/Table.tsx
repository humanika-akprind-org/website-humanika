"use client";

import { useRef, useState } from "react";
import { FiEdit, FiEye, FiTrash } from "react-icons/fi";
import { BarChart3 } from "lucide-react";
import type { Statistic } from "@/types/statistic";
import Checkbox from "../../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import { useResourcePermission } from "@/hooks/usePermission";

interface StatisticTableProps {
  statistics: Statistic[];
  selectedStatistics: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onStatisticSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewStatistic: (statistic: Statistic) => void;
  onEditStatistic: (id: string) => void;
  onDeleteStatistic: (statistic?: Statistic) => void;
  onPageChange: (page: number) => void;
  onAddStatistic: () => void;
}

export default function StatisticTable({
  statistics,
  selectedStatistics,
  loading,
  currentPage,
  totalPages,
  onStatisticSelect,
  onSelectAll,
  onViewStatistic,
  onEditStatistic,
  onDeleteStatistic,
  onPageChange,
  onAddStatistic,
}: StatisticTableProps) {
  const { canAdd, canEdit, canDelete } = useResourcePermission("statistics");
  const [sortField, setSortField] = useState("activeMembers");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  // Sort statistics
  const sortedStatistics = [...statistics].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "activeMembers":
        aValue = a.activeMembers;
        bValue = b.activeMembers;
        break;
      case "annualEvents":
        aValue = a.annualEvents;
        bValue = b.annualEvents;
        break;
      case "createdAt":
        aValue = new Date(a.createdAt).getTime();
        bValue = new Date(b.createdAt).getTime();
        break;

      default:
        aValue = a.activeMembers;
        bValue = b.activeMembers;
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
    onSelectAll?.();
  };

  const handleSelectStatistic = (id: string) => {
    onStatisticSelect?.(id);
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
                    sortedStatistics.length > 0 &&
                    selectedStatistics.length === sortedStatistics.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("activeMembers")}
              >
                <div className="flex items-center">
                  Active Members
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="activeMembers"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("annualEvents")}
              >
                <div className="flex items-center">
                  Annual Events
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="annualEvents"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Collaborative Projects
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Innovation Projects
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Awards
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Member Satisfaction
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("createdAt")}
              >
                <div className="flex items-center">
                  Created
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="createdAt"
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
            {sortedStatistics.map((statistic, index) => (
              <tr
                key={statistic.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedStatistics.includes(statistic.id)}
                    onChange={() => handleSelectStatistic(statistic.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.activeMembers}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.annualEvents}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.collaborativeProjects}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.innovationProjects}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.awards}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                  {statistic.memberSatisfaction}%
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(new Date(statistic.createdAt))}
                </td>
                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedStatistics.length - 1}
                    hasMultipleItems={sortedStatistics.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewStatistic(statistic)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    {canEdit() && (
                      <DropdownMenuItem
                        onClick={() => onEditStatistic(statistic.id)}
                        color="blue"
                      >
                        <FiEdit className="mr-2" size={14} />
                        Edit
                      </DropdownMenuItem>
                    )}
                    {canDelete() && (
                      <DropdownMenuItem
                        onClick={() => onDeleteStatistic(statistic)}
                        color="red"
                      >
                        <FiTrash className="mr-2" size={14} />
                        Delete
                      </DropdownMenuItem>
                    )}
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {sortedStatistics.length === 0 && !loading && (
        <EmptyState
          icon={<BarChart3 size={48} className="mx-auto" />}
          title="No statistics found"
          description="Try adjusting your search or filter criteria"
          actionButton={
            canAdd() ? (
              <AddButton onClick={onAddStatistic} text="Add Statistic" />
            ) : null
          }
        />
      )}

      {/* Table Footer */}
      {sortedStatistics.length > 0 && (
        <Pagination
          usersLength={sortedStatistics.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
}
