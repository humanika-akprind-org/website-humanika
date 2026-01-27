"use client";

import { useParams } from "next/navigation";
import LetterForm from "@/presentation/components/admin/pages/letter/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useEditLetter } from "@/presentation/hooks/letter/useEditLetter";
import { useLetterFormData } from "@/presentation/hooks/letter/useLetterFormData";

export default function EditLetterPage() {
  const params = useParams();
  const letterId = params.id as string;

  const { letter, loading, error, updateLetter, handleBack } =
    useEditLetter(letterId);

  const {
    periods,
    events,
    loading: formDataLoading,
    error: formDataError,
  } = useLetterFormData();

  const isLoading = loading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Letter" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {isLoading ? (
        <LoadingForm />
      ) : letter ? (
        <LetterForm
          letter={letter}
          events={events}
          periods={periods}
          onSubmit={updateLetter}
          isEditing={true}
        />
      ) : null}
    </div>
  );
}
