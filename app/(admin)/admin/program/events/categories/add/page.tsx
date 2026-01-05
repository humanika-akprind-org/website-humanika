"use client";

import EventCategoryForm from "@/components/admin/pages/event/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateEventCategory } from "@/hooks/event-category/useCreateEventCategory";

export default function AddEventCategoryPage() {
  const { createEventCategory, handleBack, isSubmitting, error, isLoading } =
    useCreateEventCategory();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Event Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting || isLoading ? (
        <LoadingForm />
      ) : (
        <EventCategoryForm onSubmit={createEventCategory} />
      )}
    </div>
  );
}
