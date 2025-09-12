import { useState } from "react";
import Link from "next/link";
import { FiCalendar } from "react-icons/fi";
import type { Event } from "@/types/event";
import type { Status } from "@/types/enums";
import { Status as StatusEnum } from "@/types/enums";
import Image from "next/image";
import EventStats from "./Stats";
import EventFilters from "./Filters";
import DeleteModal from "./modal/DeleteModal";

interface EventTableProps {
  events: Event[];
  onDelete: (id: string) => void;
  accessToken?: string;
}

export default function EventTable({ events, onDelete, accessToken }: EventTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);

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

  const extractFileId = (url: string) =>
    url.match(/\/file\/d\/([a-zA-Z0-9-_]+)/)?.[1] || null;

  const getProxyImageUrl = (fileId: string) =>
    `/api/drive-image?fileId=${fileId}`;

  const hasImageError = (url: string) => imageErrors.has(url);

  const handleImageError = (url: string) =>
    setImageErrors((prev) => new Set(prev).add(url));

  const getStatusColor = (status: Status) => {
    switch (status) {
      case StatusEnum.DRAFT:
        return "bg-gray-100 text-gray-800";
      case StatusEnum.PENDING:
        return "bg-yellow-100 text-yellow-800";
      case StatusEnum.APPROVED:
        return "bg-green-100 text-green-800";
      case StatusEnum.REJECTED:
        return "bg-red-100 text-red-800";
      case StatusEnum.REVISION:
        return "bg-orange-100 text-orange-800";
      case StatusEnum.ARCHIVED:
        return "bg-gray-100 text-gray-600";
      case StatusEnum.ONGOING:
        return "bg-blue-100 text-blue-800";
      case StatusEnum.COMPLETED:
        return "bg-green-100 text-green-800";
      case StatusEnum.CANCELLED:
        return "bg-red-100 text-red-800";
      case StatusEnum.POSTPONED:
        return "bg-yellow-100 text-yellow-600";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const handleDelete = (event: Event) => {
    setEventToDelete(event);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (eventToDelete) {
      onDelete(eventToDelete.id);
      setIsDeleteModalOpen(false);
      setEventToDelete(null);
    }
  };

  const handleCloseDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setEventToDelete(null);
  };

  // Filter events based on search term and filters
  const filteredEvents = events.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      event.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;
    const matchesPeriod =
      periodFilter === "all" || event.period.id === periodFilter;
    const matchesDepartment =
      departmentFilter === "all" || event.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPeriod && matchesDepartment;
  });

  // Toggle event selection
  const toggleEventSelection = (id: string) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((eventId) => eventId !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  // Select all filtered events
  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
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
        statusFilter={statusFilter}
        onStatusFilterChange={(status: string) =>
          setStatusFilter(status as any)
        }
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
        selectedCount={selectedEvents.length}
        onDeleteSelected={() => {
          if (
            window.confirm(
              `Are you sure you want to delete ${selectedEvents.length} selected events?`
            )
          ) {
            selectedEvents.forEach((id) => onDelete(id));
            setSelectedEvents([]);
          }
        }}
      />

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-6">
        <div>
          <p className="text-sm text-gray-500 mt-1">
            {filteredEvents.length} of {events.length} events
          </p>
        </div>
      </div>

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => (
            <div
              key={event.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-start space-x-4">
                {/* Checkbox */}
                <div className="flex-shrink-0 pt-1">
                  <input
                    type="checkbox"
                    checked={selectedEvents.includes(event.id)}
                    onChange={() => toggleEventSelection(event.id)}
                    className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 h-4 w-4"
                  />
                </div>

                {/* Thumbnail */}
                <div className="flex-shrink-0 relative">
                  {(() => {
                    const fileId = extractFileId(event.thumbnail || "");
                    const proxyImageUrl = fileId ? getProxyImageUrl(fileId) : null;
                    const hasError = proxyImageUrl ? hasImageError(proxyImageUrl) : false;

                    if (proxyImageUrl && !hasError) {
                      return (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200 overflow-hidden">
                          <Image
                            src={proxyImageUrl}
                            alt={event.name}
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-full"
                            onError={() => handleImageError(proxyImageUrl)}
                            unoptimized={true}
                          />
                        </div>
                      );
                    } else {
                      return (
                        <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-gray-200">
                          <svg
                            className="w-8 h-8 text-gray-500"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                          </svg>
                        </div>
                      );
                    }
                  })()}
                </div>

                {/* Details */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-800 truncate">
                    {event.name}
                  </h3>
                  <p className="text-sm text-gray-600 truncate max-w-xs">
                    {event.description}
                  </p>
                  <p className="text-sm text-blue-600 font-medium">
                    {event.department}
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    {formatDate(event.startDate)} - {formatDate(event.endDate)}
                  </p>
                  <p className="text-xs text-gray-400">
                    Budget: {formatCurrency(event.funds)}
                  </p>
                  <div className="mt-2">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        event.status
                      )}`}
                    >
                      {event.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Responsible: {event.responsible.name}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                <Link
                  href={`/admin/programs/events/${event.id}`}
                  className="px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 border border-blue-200"
                >
                  View
                </Link>
                <Link
                  href={`/admin/programs/events/edit/${event.id}`}
                  className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(event)}
                  className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200"
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <FiCalendar className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-sm font-medium text-gray-900">
              No events found
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              {events.length === 0
                ? "Get started by creating your first event."
                : "No events match the selected filters."}
            </p>
          </div>
        )}
      </div>
      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={handleCloseDeleteModal}
        onConfirm={handleConfirmDelete}
        eventName={eventToDelete?.name || ""}
        isLoading={false}
      />
    </div>
  );
}
