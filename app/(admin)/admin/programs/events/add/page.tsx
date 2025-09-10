"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft } from "react-icons/fi";
import Link from "next/link";
import EventForm from "@/components/admin/event/Form";
import type { CreateEventInput, UpdateEventInput } from "@/types/event";
import { useToast } from "@/hooks/use-toast";

export default function AddEventPage() {
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (data: CreateEventInput | UpdateEventInput) => {
    try {
      setIsLoading(true);

      const response = await fetch("/api/event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Event created successfully",
        });
        router.push("/admin/programs/events");
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create event",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error("Error creating event:", error);
      toast({
        title: "Error",
        description: "Failed to create event",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

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
            <h1 className="text-2xl font-bold text-gray-900">Add New Event</h1>
            <p className="text-gray-600">Create a new event for your organization</p>
          </div>
        </div>
      </div>

      {/* Event Form */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100">
        <div className="px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-medium text-gray-900">Event Details</h2>
          <p className="text-sm text-gray-600">
            Fill in the information below to create a new event.
          </p>
        </div>
        <div className="p-6">
          <EventForm onSubmit={handleSubmit} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
}
