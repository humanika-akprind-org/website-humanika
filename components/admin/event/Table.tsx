import { useState, useEffect } from "react";
import Link from "next/link";
import { FiCalendar, FiUser } from "react-icons/fi";
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

interface ImageState {
  [key: string]: {
    isLoading: boolean;
    hasError: boolean;
    isLoaded: boolean;
  };
}

// Helper function to get preview URL from photo (file ID or URL)
const getPreviewUrl = (photo: string | null | undefined): string | null => {
  if (!photo) return null;

  if (photo.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `https://drive.google.com/uc?export=view&id=${fileIdMatch[1]}`;
    }

    // Try other common Google Drive URL patterns
    const otherPatterns = [
      /\/open\?id=([a-zA-Z0-9_-]+)/,
      /\/uc\?id=([a-zA-Z0-9_-]+)/,
      /id=([a-zA-Z0-9_-]+)/,
    ];

    for (const pattern of otherPatterns) {
      const match = photo.match(pattern);
      if (match) {
        return `https://drive.google.com/uc?export=view&id=${match[1]}`;
      }
    }

    return photo;
  } else if (photo.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `https://drive.google.com/uc?export=view&id=${photo}`;
  } else {
    // It's a direct URL or other format
    return photo;
  }
};

export default function EventTable({
  events,
  onDelete,
}: EventTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<Status | "all">("all");
  const [periodFilter, setPeriodFilter] = useState<string>("all");
  const [departmentFilter, setDepartmentFilter] = useState<string>("all");
  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [imageStates, setImageStates] = useState<ImageState>({});
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<Event | null>(null);
  const [isBulkDelete, setIsBulkDelete] = useState(false);

  const handleStatusFilterChange = (status: string) =>
    (status === "all" ||
      Object.values(StatusEnum).includes(status as StatusEnum)) &&
    setStatusFilter(status as Status | "all");

  // Initialize image states when events change
  useEffect(() => {
    const newImageStates: ImageState = {};

    events.forEach((event) => {
      if (event.thumbnail) {
        const imageUrl = getPreviewUrl(event.thumbnail);
        if (imageUrl) {
          // Initialize state for this image URL if not already present
          if (!imageStates[imageUrl]) {
            newImageStates[imageUrl] = {
              isLoading: true,
              hasError: false,
              isLoaded: false,
            };
          }
        }
      }
    });

    setImageStates((prev) => ({ ...prev, ...newImageStates }));
  }, [events]);

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

  const handleImageLoad = (imageUrl: string) => {
    setImageStates((prev) => ({
      ...prev,
      [imageUrl]: {
        isLoading: false,
        hasError: false,
        isLoaded: true,
      },
    }));
  };

  const handleImageError = (imageUrl: string) => {
    console.error(`Failed to load image: ${imageUrl}`);
    setImageStates((prev) => ({
      ...prev,
      [imageUrl]: {
        isLoading: false,
        hasError: true,
        isLoaded: false,
      },
    }));
  };

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
      event.responsible?.name?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus =
      statusFilter === "all" || event.status === statusFilter;

    const matchesPeriod =
      periodFilter === "all" || event.period?.id === periodFilter;

    const matchesDepartment =
      departmentFilter === "all" || event.department === departmentFilter;

    return matchesSearch && matchesStatus && matchesPeriod && matchesDepartment;
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
        statusFilter={statusFilter}
        onStatusFilterChange={handleStatusFilterChange}
        periodFilter={periodFilter}
        onPeriodFilterChange={setPeriodFilter}
        departmentFilter={departmentFilter}
        onDepartmentFilterChange={setDepartmentFilter}
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

      {/* Event Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.length > 0 ? (
          filteredEvents.map((event) => {
            const imageUrl = getPreviewUrl(event.thumbnail || "");
            const imageState = imageUrl ? imageStates[imageUrl] : null;

            return (
              <div
                key={event.id}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow bg-white"
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

                  {/* Details */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-800 truncate">
                      {event.name}
                    </h3>
                    <p className="text-sm text-gray-600 truncate max-w-xs">
                      {event.description || "No description"}
                    </p>
                    <p className="text-sm text-blue-600 font-medium">
                      {event.department || "No department"}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(event.startDate)} -{" "}
                      {formatDate(event.endDate)}
                    </p>
                    <p className="text-xs text-gray-400">
                      Budget: {formatCurrency(event.funds || 0)}
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
                      <FiUser className="inline mr-1" />
                      {event.responsible?.name || "Unknown"}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t border-gray-100">
                  <Link
                    href={`/admin/programs/events/edit/${event.id}`}
                    className="px-3 py-1 text-sm bg-yellow-50 text-yellow-700 rounded hover:bg-yellow-100 border border-yellow-200 transition-colors"
                  >
                    Edit
                  </Link>
                  <button
                    onClick={() => handleDelete(event)}
                    className="px-3 py-1 text-sm bg-red-50 text-red-700 rounded hover:bg-red-100 border border-red-200 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
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
        count={isBulkDelete ? selectedEvents.length : 1}
        isLoading={false}
      />
    </div>
  );
}
