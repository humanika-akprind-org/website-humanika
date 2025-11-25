import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  FiCalendar,
  FiUser,
  FiImage,
  FiCheckCircle,
  FiXCircle,
  FiClock,
} from "react-icons/fi";
import type { Event } from "@/types/event";
import type { Status } from "@/types/enums";
import { Status as StatusEnum } from "@/types/enums";
import EventStats from "./Stats";
import EventFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface EventTableProps {
  events: Event[];
  onDelete: (id: string) => void;
  accessToken?: string;
}

export default function EventTable({ events, onDelete }: EventTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [workProgramFilter, setWorkProgramFilter] = useState<string>("all");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as unknown as StatusEnum)) &&
    setStatusFilter(status === "all" ? "all" : (status as unknown as Status));

  const formatDate = (date: Date) =>
    new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    }).format(new Date(date));

  const formatCurrency = (amount: number) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.PUBLISH:
        return "bg-green-100 text-green-800";
      case StatusEnum.PRIVATE:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.ARCHIVE:
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Helper function to get preview URL from image (file ID or URL)
  const getPreviewUrl = (image: string | null | undefined): string => {
    if (!image) return "";

    if (image.includes("drive.google.com")) {
      // It's a full Google Drive URL, convert to direct image URL
      const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      if (fileIdMatch) {
        return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
      }
      return image;
    } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
      // It's a Google Drive file ID, construct direct URL
      return `https://drive.google.com/uc?export=view&id=${image}`;
    } else {
      // It's a direct URL or other format
      return image;
    }
  };

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (isBulkDelete) {
      selectedEvents.forEach((id) => onDelete(id));
      setSelectedEvents([]);
    } else if (eventToDelete) {
      onDelete(eventToDelete.id);
    }
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
    setIsBulkDelete(false);
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
    setIsBulkDelete(false);
  };

  // Filter events based on search term and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.responsible?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    const matchesPeriod =
      periodFilter === "all" || event.period?.id === periodFilter;

    const matchesDepartment =
      departmentFilter === "all" || event.department === departmentFilter;

    const matchesWorkProgram =
      workProgramFilter === "all" ||
      event.workProgram?.id === workProgramFilter;

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPeriod &&
      matchesDepartment &&
      matchesWorkProgram
    );
  });

  // Toggle event selection
  const toggleEventSelection = (id: string) => {
    setSelectedEvents((prev) =>
      prev.includes(id)
        ? prev.filter((eventId) => eventId !== id)
        : [...prev, id]
    );
  };

  // Handle bulk delete
  const handleBulkDelete = () => {
    if (selectedEvents.length === 0) return;

    setIsBulkDelete(true);
    setIsDeleteModalOpen(true);
  };

  if (events.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8 text-center">
        <FiCalendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No events found
        </h3>
        <p className="text-gray-500">
          Get started by creating your first event.
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl">
      <EventStats events={filteredEvents} />

      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter.toString()}
        onStatusFilterChange={handleStatusFilterChange}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        workProgramFilter={workProgramFilter}
        onWorkProgramFilterChange={setWorkProgramFilter}
        selectedCount={selectedEvents.length}
        onDeleteSelected={handleBulkDelete}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            Showing {filteredEvents.length} of {events.length} events
          </p>
        </div>

        {selectedEvents.length > 0 && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">
              {selectedEvents.length} event
              {selectedEvents.length > 1 ? "s" : ""} selected
            </span>
          </div>
        )}
      </div>

      {/* Events Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  scope="col"
                  className="pl-6 pr-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12"
                >
                  <input
                    type="checkbox"
                    checked={
                      filteredEvents.length > 0 &&
                      selectedEvents.length === filteredEvents.length
                    }
                    onChange={() => {
                      if (selectedEvents.length === filteredEvents.length) {
                        setSelectedEvents([]);
                      } else {
                        setSelectedEvents(
                          filteredEvents.map((event) => event.id)
                        );
                      }
                    }}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Thumbnail
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Event
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                  style={{ width: "300px", minWidth: "300px" }}
                >
                  Description
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
                  Category
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Status
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Approval
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Date Range
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Budget
                </th>
                <th
                  scope="col"
                  className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Responsible
                </th>
                <th
                  scope="col"
                  className="pl-4 pr-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                >
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredEvents.length > 0 ? (
                filteredEvents.map((event) => (
                  <tr
                    key={event.id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="pl-6 pr-2 py-4 whitespace-nowrap">
                      <input
                        type="checkbox"
                        checked={selectedEvents.includes(event.id)}
                        onChange={() => toggleEventSelection(event.id)}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                      />
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="flex-shrink-0 h-12 w-12">
                        {event.thumbnail && !imageErrors.has(event.id) ? (
                          <Image
                            className="h-12 w-12 rounded-lg object-cover"
                            src={getPreviewUrl(event.thumbnail)}
                            alt={event.name}
                            width={48}
                            height={48}
                            onError={() =>
                              setImageErrors((prev) =>
                                new Set(prev).add(event.id)
                              )
                            }
                          />
                        ) : (
                          <div className="h-12 w-12 rounded-lg bg-gray-100 flex items-center justify-center">
                            <FiImage className="h-6 w-6 text-gray-400" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {event.name}
                      </div>
                    </td>
                    <td
                      className="px-4 py-4"
                      style={{ width: "300px", minWidth: "300px" }}
                    >
                      <div className="text-sm text-gray-600 break-words">
                        {event.description
                          ? event.description.length > 50
                            ? `${event.description
                                .replace(/<[^>]*>/g, "")
                                .substring(0, 50)}...`
                            : event.description.replace(/<[^>]*>/g, "")
                          : "No description"}
                      </div>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.department || "No department"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      {event.category?.name || "No category"}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      <span
                        className={`px-2.5 py-0.5 text-xs font-medium rounded-full ${getStatusColor(
                          event.status
                        )}`}
                      >
                        {event.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap">
                      {event.approvals && event.approvals.length > 0 ? (
                        (() => {
                          // Get the latest approval (most recent by createdAt)
                          const latestApproval = event.approvals.sort(
                            (a, b) =>
                              new Date(b.createdAt).getTime() -
                              new Date(a.createdAt).getTime()
                          )[0];
                          return (
                            <span
                              className={`px-2 py-1 text-xs font-medium rounded-full flex items-center w-fit ${
                                latestApproval.status === "APPROVED"
                                  ? "bg-green-100 text-green-800"
                                  : latestApproval.status === "REJECTED"
                                  ? "bg-red-100 text-red-800"
                                  : "bg-yellow-100 text-yellow-800"
                              }`}
                            >
                              {latestApproval.status === "APPROVED" && (
                                <FiCheckCircle className="mr-1" />
                              )}
                              {latestApproval.status === "REJECTED" && (
                                <FiXCircle className="mr-1" />
                              )}
                              {latestApproval.status === "PENDING" && (
                                <FiClock className="mr-1" />
                              )}
                              {latestApproval.status}
                            </span>
                          );
                        })()
                      ) : (
                        <span className="text-xs text-gray-400">
                          No approval
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatCurrency(event.funds || 0)}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600">
                      <div className="flex items-center">
                        <FiUser className="mr-2 text-gray-400" size={14} />
                        {event.responsible?.name || "Unknown"}
                      </div>
                    </td>
                    <td className="pl-4 pr-6 py-4 whitespace-nowrap">
                      <div className="flex items-center space-x-2">
                        <Link
                          href={`/admin/program/events/edit/${event.id}`}
                          className="p-1.5 rounded-lg text-blue-600 hover:bg-blue-50 transition-colors"
                          title="Edit event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                            />
                          </svg>
                        </Link>
                        <button
                          className="p-1.5 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
                          onClick={() => handleDelete(event)}
                          title="Delete event"
                        >
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={12} className="px-6 py-12 text-center">
                    <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
                    <h3 className="mt-4 text-sm font-medium text-gray-900">
                      No events found
                    </h3>
                    <p className="mt-1 text-sm text-gray-500">
                      {events.length === 0
                        ? "Get started by creating your first event."
                        : "No events match the selected filters."}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        {filteredEvents.length > 0 && (
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex flex-col sm:flex-row items-center justify-between">
            <p className="text-sm text-gray-700 mb-4 sm:mb-0">
              Showing{" "}
              <span className="font-medium">{filteredEvents.length}</span> of{" "}
              <span className="font-medium">{events.length}</span> events
            </p>
            <div className="flex space-x-2">
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Previous
              </button>
              <button
                className="px-3 py-1.5 text-sm border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100 disabled:opacity-50"
                disabled
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        eventName={eventToDelete?.name || ""}
        count={isBulkDelete ? selectedEvents.length : 1}
        isLoading={false}
      />
    </div>
  );
}
