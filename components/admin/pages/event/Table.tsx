"use client";

import { useRef, useState } from "react";
import { FiCalendar, FiEdit, FiTrash, FiEye } from "react-icons/fi";
import type { Event } from "@/types/event";
import Checkbox from "../../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../../ui/dropdown/DropdownMenu";
import EmptyState from "../../ui/EmptyState";
import AddButton from "../../ui/button/AddButton";
import SortIcon from "../../ui/SortIcon";
import Pagination from "../../ui/pagination/Pagination";
import ThumbnailCell from "../../ui/ThumbnailCell";
import StatusChip from "../../ui/chip/Status";
import StatusApproval from "../../ui/chip/StatusApproval";
import DepartmentChip from "../../ui/chip/Department";

interface EventTableProps {
  events: Event[];
  selectedEvents: string[];
  loading: boolean;
  currentPage: number;
  totalPages: number;
  onEventSelect: (id: string) => void;
  onSelectAll: () => void;
  onViewEvent: (event: Event) => void;
  onEditEvent: (id: string) => void;
  onDeleteEvent: (event?: Event) => void;
  onPageChange: (page: number) => void;
  onAddEvent: () => void;
}

const EventTable: React.FC<EventTableProps> = ({
  events,
  selectedEvents,
  loading,
  currentPage,
  totalPages,
  onEventSelect,
  onSelectAll,
  onViewEvent,
  onEditEvent,
  onDeleteEvent,
  onPageChange,
  onAddEvent,
}) => {
  const [sortField, setSortField] = useState("name");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // Sort events
  const sortedEvents = [...events].sort((a, b) => {
    let aValue, bValue;

    switch (sortField) {
      case "name":
        aValue = a.name.toLowerCase();
        bValue = b.name.toLowerCase();
        break;
      case "department":
        aValue = a.department?.toLowerCase() || "";
        bValue = b.department?.toLowerCase() || "";
        break;
      case "period":
        aValue = a.period?.name?.toLowerCase() || "";
        bValue = b.period?.name?.toLowerCase() || "";
        break;
      case "workProgram":
        aValue = a.workProgram?.name?.toLowerCase() || "";
        bValue = b.workProgram?.name?.toLowerCase() || "";
        break;

      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "scheduleDate":
        // Sort by earliest schedule date
        aValue =
          a.schedules && a.schedules.length > 0
            ? Math.min(...a.schedules.map((s) => new Date(s.date).getTime()))
            : 0;
        bValue =
          b.schedules && b.schedules.length > 0
            ? Math.min(...b.schedules.map((s) => new Date(s.date).getTime()))
            : 0;
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

  const handleSelectAll = () => {
    onSelectAll();
  };

  const handleEventSelect = (id: string) => {
    onEventSelect(id);
  };

  const handleEditEvent = (id: string) => {
    onEditEvent(id);
  };

  const handleAddEvent = () => {
    onAddEvent();
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
                    sortedEvents.length > 0 &&
                    selectedEvents.length === sortedEvents.length
                  }
                  onChange={handleSelectAll}
                />
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("name")}
              >
                <div className="flex items-center">
                  Event Name
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
                onClick={() => handleSort("scheduleDate")}
              >
                <div className="flex items-center">
                  Date Range
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="scheduleDate"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("workProgram")}
              >
                <div className="flex items-center">
                  Work Program
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="workProgram"
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
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Approval
              </th>
              <th
                scope="col"
                className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              />
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedEvents.map((event, index) => (
              <tr
                key={event.id}
                ref={(el) => {
                  rowRefs.current[index] = el;
                }}
                className="hover:bg-gray-50 transition-colors"
              >
                <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                  <Checkbox
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => handleEventSelect(event.id)}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <ThumbnailCell
                    thumbnail={event.thumbnail}
                    name={event.name}
                    categoryName={event.category?.name}
                  />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {(() => {
                    // Get earliest and latest dates from schedules
                    const hasSchedules =
                      event.schedules && event.schedules.length > 0;
                    const startDate = hasSchedules
                      ? new Date(
                          Math.min(
                            ...event.schedules.map((s) =>
                              new Date(s.date).getTime()
                            )
                          )
                        )
                      : null;
                    const endDate = hasSchedules
                      ? new Date(
                          Math.max(
                            ...event.schedules.map((s) =>
                              new Date(s.date).getTime()
                            )
                          )
                        )
                      : startDate;

                    if (!startDate) return "No date set";

                    return (
                      <>
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(startDate)}{" "}
                        -{" "}
                        {new Intl.DateTimeFormat("id-ID", {
                          day: "2-digit",
                          month: "2-digit",
                          year: "numeric",
                        }).format(endDate || startDate)}
                      </>
                    );
                  })()}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <DepartmentChip department={event.department} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.period?.name || "No period"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.workProgram?.name || "No work program"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusChip status={event.status} />
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <StatusApproval
                    status={
                      event.approvals.length > 0
                        ? event.approvals.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )[0].status
                        : "PENDING"
                    }
                  />
                </td>

                <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                  <DropdownMenu
                    boundaryRef={{ current: rowRefs.current[index] }}
                    isLastItem={index === sortedEvents.length - 1}
                    hasMultipleItems={sortedEvents.length > 1}
                  >
                    <DropdownMenuItem
                      onClick={() => onViewEvent(event)}
                      color="default"
                    >
                      <FiEye className="mr-2" size={14} />
                      View
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => handleEditEvent(event.id)}
                      color="blue"
                    >
                      <FiEdit className="mr-2" size={14} />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => onDeleteEvent(event)}
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

      {sortedEvents.length === 0 && !loading && (
        <EmptyState
          icon={<FiCalendar size={48} className="mx-auto" />}
          title="No events found"
          description="Try adjusting your search or filter criteria"
          actionButton={<AddButton onClick={handleAddEvent} text="Add Event" />}
        />
      )}

      {sortedEvents.length > 0 && (
        <Pagination
          usersLength={sortedEvents.length}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={onPageChange}
        />
      )}
    </div>
  );
};

export default EventTable;
