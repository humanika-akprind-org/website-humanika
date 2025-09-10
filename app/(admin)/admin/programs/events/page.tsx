"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { FiPlus, FiDownload, FiUpload } from "react-icons/fi";
import EventFilters from "@/components/admin/event/Filters";
import EventTable from "@/components/admin/event/Table";
import EventStats from "@/components/admin/event/Stats";
import DeleteModal from "@/components/admin/event/modal/DeleteModal";
import type { Event } from "@/types/event";
import type { EventFilter } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

export default function EventsPage() {
  const [events, setEvents] = useState<Event[]>([]);
  const [filteredEvents, setFilteredEvents] = useState<Event[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    eventId: "",
    eventName: "",
  });
  const { toast } = useToast();

  // Fetch events
  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    try {
      setIsLoading(true);
      const response = await fetch("/api/event");
      if (response.ok) {
        const data = await response.json();
        setEvents(data.events || []);
        setFilteredEvents(data.events || []);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch events",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching events:", error);
      toast({
        title: "Error",
        description: "Failed to fetch events",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFilterChange = (filters: EventFilter) => {
    let filtered = [...events];

    // Search filter
    if (filters.search) {
      const searchTerm = filters.search.toLowerCase();
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm) ||
          event.description.toLowerCase().includes(searchTerm) ||
          event.department.toLowerCase().includes(searchTerm)
      );
    }

    // Department filter
    if (filters.department) {
      filtered = filtered.filter((event) => event.department === filters.department);
    }

    // Status filter
    if (filters.status) {
      filtered = filtered.filter((event) => event.status === filters.status);
    }

    // Date range filter
    if (filters.startDate) {
      filtered = filtered.filter(
        (event) => new Date(event.startDate) >= filters.startDate!
      );
    }

    if (filters.endDate) {
      filtered = filtered.filter(
        (event) => new Date(event.startDate) <= filters.endDate!
      );
    }

    setFilteredEvents(filtered);
  };

  const handleDelete = async (eventId: string) => {
    try {
      const response = await fetch(`/api/event/${eventId}`, {
        method: "DELETE",
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event deleted successfully",
        });
        fetchEvents(); // Refresh the list
      } else {
        toast({
          title: "Error",
          description: "Failed to delete event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      toast({
        title: "Error",
        description: "Failed to delete event",
        variant: "destructive",
      });
    } finally {
      setDeleteModal({ isOpen: false, eventId: "", eventName: "" });
    }
  };

  const openDeleteModal = (eventId: string, eventName: string) => {
    setDeleteModal({
      isOpen: true,
      eventId,
      eventName,
    });
  };

  const closeDeleteModal = () => {
    setDeleteModal({ isOpen: false, eventId: "", eventName: "" });
  };

  const exportEvents = () => {
    // Export functionality would be implemented here
    toast({
      title: "Export",
      description: "Export functionality will be implemented",
    });
  };

  const importEvents = () => {
    // Import functionality would be implemented here
    toast({
      title: "Import",
      description: "Import functionality will be implemented",
    });
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Events Management</h1>
          <p className="text-gray-600">Manage and organize your events</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3">
          <button
            onClick={exportEvents}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiDownload className="h-4 w-4 mr-2" />
            Export
          </button>
          <button
            onClick={importEvents}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiUpload className="h-4 w-4 mr-2" />
            Import
          </button>
          <Link
            href="/admin/programs/events/add"
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <FiPlus className="h-4 w-4 mr-2" />
            Add Event
          </Link>
        </div>
      </div>

      {/* Stats */}
      <EventStats events={events} />

      {/* Filters */}
      <EventFilters onFilterChange={handleFilterChange} />

      {/* Events Table */}
      {isLoading ? (
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-8">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/4 mb-4" />
            <div className="space-y-3">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      ) : (
        <EventTable
          events={filteredEvents}
          onDelete={(id) => {
            const event = events.find((e) => e.id === id);
            if (event) {
              openDeleteModal(id, event.name);
            }
          }}
        />
      )}

      {/* Delete Modal */}
      <DeleteModal
        isOpen={deleteModal.isOpen}
        onClose={closeDeleteModal}
        onConfirm={() => handleDelete(deleteModal.eventId)}
        eventName={deleteModal.eventName}
      />
    </div>
  );
}
