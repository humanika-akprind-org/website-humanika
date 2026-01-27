"use client";

import { useParams } from "next/navigation";
import EventForm from "@/presentation/components/admin/pages/event/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useEditEvent } from "@/presentation/hooks/event/useEditEvent";
import { useEventFormData } from "@/presentation/hooks/event/useEventFormData";

export default function EditEventPage() {
  const params = useParams();
  const eventId = params.id as string;

  const { event, loading, error, updateEvent, handleBack } =
    useEditEvent(eventId);

  const {
    users,
    periods,
    loading: formDataLoading,
    error: formDataError,
  } = useEventFormData();

  const isLoading = loading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Event" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {isLoading ? (
        <LoadingForm />
      ) : event ? (
        <EventForm
          event={event}
          onSubmit={updateEvent}
          users={users}
          periods={periods}
          isEditing={true}
        />
      ) : null}
    </div>
  );
}
