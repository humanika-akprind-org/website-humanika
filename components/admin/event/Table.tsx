"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { FiCalendar, FiImage, FiEdit, FiTrash, FiEye } from "react-icons/fi";
import type { Event } from "@/types/event";
import { Status as StatusEnum } from "@/types/enums";
import Checkbox from "../ui/checkbox/Checkbox";
import DropdownMenu, { DropdownMenuItem } from "../ui/dropdown/DropdownMenu";
import EmptyState from "../ui/EmptyState";
import AddButton from "../ui/button/AddButton";
import SortIcon from "../ui/SortIcon";
import Pagination from "../ui/pagination/Pagination";

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
      case "status":
        aValue = a.status.toLowerCase();
        bValue = b.status.toLowerCase();
        break;
      case "startDate":
        aValue = new Date(a.startDate).getTime();
        bValue = new Date(b.startDate).getTime();
        break;
      case "funds":
        aValue = a.funds || 0;
        bValue = b.funds || 0;
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
                onClick={() => handleSort("startDate")}
              >
                <div className="flex items-center">
                  Date Range
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="startDate"
                    iconType="arrow"
                  />
                </div>
              </th>
              <th
                scope="col"
                className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                onClick={() => handleSort("funds")}
              >
                <div className="flex items-center">
                  Budget
                  <SortIcon
                    sortField={sortField}
                    sortDirection={sortDirection}
                    field="funds"
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
                  <div className="flex items-center">
                    <div className="flex-shrink-0 h-10 w-10">
                      {event.thumbnail ? (
                        <Image
                          className="h-10 w-10 rounded-lg object-cover"
                          src={event.thumbnail}
                          alt={event.name}
                          width={40}
                          height={40}
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                          <FiImage className="h-5 w-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="ml-4">
                      <div className="text-sm font-medium text-gray-900">
                        {event.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {event.category?.name || "No category"}
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                  {event.department || "No department"}
                </td>
                <td className="px-4 py-4 whitespace-nowrap">
                  <span
                    className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${
                      event.status === StatusEnum.PUBLISH
                        ? "bg-green-100 text-green-800"
                        : event.status === StatusEnum.DRAFT
                        ? "bg-gray-100 text-gray-800"
                        : event.status === StatusEnum.PRIVATE
                        ? "bg-blue-100 text-blue-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {event.status}
                  </span>
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(event.startDate))}{" "}
                  -{" "}
                  {new Intl.DateTimeFormat("id-ID", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }).format(new Date(event.endDate))}
                </td>
                <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Intl.NumberFormat("id-ID", {
                    style: "currency",
                    currency: "IDR",
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
                  }).format(event.funds || 0)}
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
