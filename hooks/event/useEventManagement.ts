import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/use-cases/api/event";
import type { Event } from "@/types/event";
import { useEvents } from "./useEvents";

export function useEventManagement() {
  const router = useRouter();
  const { events, isLoading, error, refetch } = useEvents();

  const [selectedEvents, setSelectedEvents] = useState<string[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<Event | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Apply client-side filtering and pagination
  const filteredEvents = events.filter(
    (event) =>
      event.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      (event.description &&
        event.description
          .toLowerCase()
          .includes(debouncedSearchTerm.toLowerCase()))
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
      if (currentEvent) {
        await deleteEvent(currentEvent.id);
        setSuccess("Event deleted successfully");
        refetch();
      } else if (selectedEvents.length > 0) {
        for (const eventId of selectedEvents) {
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
