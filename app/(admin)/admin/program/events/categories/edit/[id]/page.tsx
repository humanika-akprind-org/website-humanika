"use client";

import { useParams } from "next/navigation";
import EventForm from "components/admin/event/Form";
import LoadingForm from "components/admin/layout/loading/LoadingForm";
import PageHeader from "components/admin/ui/PageHeader";
import Alert from "components/admin/ui/alert/Alert";
import { useEditEvent } from "hooks/event/useEditEvent";
import { useEventFormData } from "hooks/event/useEventFormData";

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
