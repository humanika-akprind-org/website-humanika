import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/use-cases/api/event";
import type { Event } from "@/types/event";
import { useEvents } from "./useEvents";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
  deleteGoogleDriveFile,
} from "@/lib/google-drive/file-utils";

export function useEventManagement() {
  const router = useRouter();
  const { events, isLoading, error, refetch } = useEvents();
  const [allEvents, setAllEvents] = useState<Event[]>([]);

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Store all events for bulk operations
  useEffect(() => {
    setAllEvents(events);
  }, [events]);

  // Apply client-side filtering and pagination
  const filteredEvents = allEvents.filter(
    (event) =>
      event.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (event.description &&
        event.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase())),
  );

  useEffect(() => {
    setTotalPages(Math.ceil(filteredEvents.length / 10));
  }, [filteredEvents, currentPage]);

  // Debounce search term
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const toggleEventSelection = (id: string) => {
    if (selectedEvents.includes(id)) {
      setSelectedEvents(selectedEvents.filter((eventId) => eventId !== id));
    } else {
      setSelectedEvents([...selectedEvents, id]);
    }
  };

  const toggleSelectAll = () => {
    if (selectedEvents.length === filteredEvents.length) {
      setSelectedEvents([]);
    } else {
      setSelectedEvents(filteredEvents.map((event) => event.id));
    }
  };

  const handleAddEvent = () => {
    router.push("/admin/program/events/add");
  };

  const handleEditEvent = (id: string) => {
    router.push(`/admin/program/events/edit/${id}`);
  };

  const handleViewEvent = (event: Event) => {
    setCurrentEvent(event);
    setShowViewModal(true);
  };

  const handleDelete = (event?: Event) => {
    if (event) {
      setCurrentEvent(event);
    }
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      // Get access token for Google Drive operations
      const accessToken = await getAccessTokenAction();

      if (currentEvent) {
        // Single event deletion: Delete file from Google Drive first, then delete database record
        if (
          currentEvent.thumbnail &&
          isGoogleDriveFile(currentEvent.thumbnail)
        ) {
          const fileId = getFileIdFromFile(currentEvent.thumbnail);
          if (fileId) {
            await deleteGoogleDriveFile(fileId, accessToken);
          }
        }
        await deleteEvent(currentEvent.id);
        setSuccess("Event deleted successfully");
        refetch();
      } else if (selectedEvents.length > 0) {
        // Bulk deletion: Delete files from Google Drive first, then delete database records
        for (const eventId of selectedEvents) {
          // Find the event object to get the thumbnail URL (use allEvents to ensure data is available)
          const eventToDelete = allEvents.find((e) => e.id === eventId);
          if (
            eventToDelete?.thumbnail &&
            isGoogleDriveFile(eventToDelete.thumbnail)
          ) {
            const fileId = getFileIdFromFile(eventToDelete.thumbnail);
            if (fileId) {
              await deleteGoogleDriveFile(fileId, accessToken);
            }
          }
          await deleteEvent(eventId);
        }
        setSelectedEvents([]);
        setSuccess(`${selectedEvents.length} events deleted successfully`);
        refetch();
      }
    } catch (error) {
      console.error("Error deleting event:", error);
    } finally {
      setShowDeleteModal(false);
      setCurrentEvent(null);
    }
  };

  return {
    events: filteredEvents,
    loading: isLoading,
    error,
    success,
    selectedEvents,
    searchTerm,
    currentPage,
    totalPages,
    showDeleteModal,
    showViewModal,
    currentEvent,
    setSearchTerm,
    setCurrentPage,
    setShowDeleteModal,
    setShowViewModal,
    setCurrentEvent,
    toggleEventSelection,
    toggleSelectAll,
    handleAddEvent,
    handleEditEvent,
    handleViewEvent,
    handleDelete,
    confirmDelete,
  };
}
