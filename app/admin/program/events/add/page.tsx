"use client";

import EventForm from "@/components/admin/pages/event/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateEvent } from "@/hooks/event/useCreateEvent";
import { useEventFormData } from "@/hooks/event/useEventFormData";

export default function AddEventPage() {
  const { createEvent, handleBack, isSubmitting, error, isLoading } =
    useCreateEvent();

  const {
    users,
    periods,
    loading: formDataLoading,
    error: formDataError,
  } = useEventFormData();

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Event" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <EventForm
          onSubmit={createEvent}
          users={users}
          periods={periods}
          loading={combinedLoading}
        />
      )}
    </div>
  );
}
