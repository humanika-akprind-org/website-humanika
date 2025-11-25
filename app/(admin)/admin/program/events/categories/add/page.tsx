"use client";

import { useState } from "react";
import Link from "next/link";
import { FiArrowLeft } from "react-icons/fi";
import EventCategoryForm from "@/components/admin/event/category/Form";
import type {
  CreateEventCategoryInput,
  UpdateEventCategoryInput,
} from "@/types/event-category";
import { createEventCategory } from "@/use-cases/api/event-category";
import { useToast } from "@/hooks/use-toast";

export default function AddEventCategoryPage() {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (
    data: CreateEventCategoryInput | UpdateEventCategoryInput
  ) => {
    setIsLoading(true);
    try {
      await createEventCategory(data as CreateEventCategoryInput);
      toast({
        title: "Success",
        description: "Event category created successfully",
      });
      // Redirect is handled in the form
    } catch (error) {
      console.error("Error creating category:", error);
      throw error; // Re-throw to let the form handle it
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center mb-6">
        <Link
          href="/admin/program/events/categories"
          className="flex items-center text-gray-600 hover:text-gray-800 mr-4"
        >
          <FiArrowLeft className="mr-1" />
          Back
        </Link>
        <h1 className="text-2xl font-bold text-gray-800">
          Add New Event Category
        </h1>
      </div>

      {/* Form */}
      <EventCategoryForm onSubmit={handleSubmit} isLoading={isLoading} />
    </div>
  );
}
