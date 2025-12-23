"use client";

import LetterForm from "@/components/admin/letter/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateLetter } from "@/hooks/letter/useCreateLetter";
import { useLetterFormData } from "@/hooks/letter/useLetterFormData";

export default function AddLetterPage() {
  const {
    createLetter,
    createLetterForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  } = useCreateLetter();

  const {
    periods,
    events,
    loading: formDataLoading,
    error: formDataError,
  } = useLetterFormData();

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Letter" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <LetterForm
          onSubmit={createLetter}
          onSubmitForApproval={createLetterForApproval}
          periods={periods}
          events={events}
          isLoading={combinedLoading}
        />
      )}
    </div>
  );
}
