"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import EventForm from "@/components/admin/event/Form";
import type { Event, CreateEventInput, UpdateEventInput } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

import type { User } from "@/types/user";
import type { Period } from "@/types/period";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [event, setEvent] = useState<Event | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);

  const eventId = params.id as string;

  // Fetch event data, users, and periods
  useEffect(() => {
    if (eventId) {
      fetchEvent();
      fetchUsers();
      fetchPeriods();
    }
  }, [eventId]);

  const fetchEvent = async () => {
    try {
      setIsFetching(true);
      const response = await fetch(`/api/event/${eventId}`);
      if (response.ok) {
        const data = await response.json();
        setEvent(data);
      } else {
        toast({
          title: "Error",
          description: "Failed to fetch event",
          variant: "destructive",
        });
        router.push("/admin/programs/events");
      }
    } catch (error) {
      console.error("Error fetching event:", error);
      toast({
        title: "Error",
        description: "Failed to fetch event",
        variant: "destructive",
      });
      router.push("/admin/programs/events");
    } finally {
      setIsFetching(false);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/user?limit=50");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users || []);
      } else {
        console.error("Failed to fetch users:", response.statusText);
        toast({
          title: "Error",
          description: "Failed to fetch users",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching users:", error);
      toast({
        title: "Error",
        description: "Failed to fetch users",
        variant: "destructive",
      });
    }
  };

  const fetchPeriods = async () => {
    try {
      const response = await fetch("/api/period");
      if (response.ok) {
        const data = await response.json();
        setPeriods(data.data || []);
      } else {
        console.error("Failed to fetch periods:", response.statusText);
        toast({
          title: "Error",
          description: "Failed to fetch periods",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error fetching periods:", error);
      toast({
        title: "Error",
        description: "Failed to fetch periods",
        variant: "destructive",
      });
    }
  };

  const handleSubmit = async (data: CreateEventInput | UpdateEventInput) => {
    try {
      setIsLoading(true);

      const response = await fetch(`/api/event/${eventId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event updated successfully",
        });
        router.push("/admin/programs/events");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to update event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast({
        title: "Error",
        description: "Failed to update event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="space-y-6">
        {/* Page Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-24 bg-gray-200 rounded" />
            <div>
              <div className="h-8 w-48 bg-gray-200 rounded mb-2" />
              <div className="h-4 w-64 bg-gray-200 rounded" />
            </div>
          </div>
        </div>

        {/* Form Skeleton */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4" />
            <div className="space-y-3">
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
              <div className="h-10 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!event) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <h2 className="text-2xl font-bold text-gray-900">Event not found</h2>
          <p className="text-gray-600 mt-2">
            The event you&apos;re looking for doesn&apos;t exist.
          </p>
          <Link
            href="/admin/programs/events"
            className="inline-flex items-center px-4 py-2 mt-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            Back to Events
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            href="/admin/programs/events"
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FiArrowLeft className="h-4 w-4 mr-2" />
            Back to Events
          </Link>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Event</h1>
            <p className="text-gray-600">Update event information</p>
          </div>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Event Details</h2>
          <p className="text-sm text-gray-600">
            Update the information below to modify the event.
          </p>
        </div>
        <div className="p-6">
          <EventForm
            event={event}
            onSubmit={handleSubmit}
            isLoading={isLoading}
            accessToken=""
            users={users}
            periods={periods}
          />
        </div>
      </div>
    </div>
  );
}
