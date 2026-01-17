"use client";

import { useParams } from "next/navigation";
import DocumentForm from "@/components/admin/pages/document/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useEditDocument } from "@/hooks/document/useEditDocument";
import { useDocumentFormData } from "@/hooks/document/useDocumentFormData";

export default function EditDocumentPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    document,
    loading,
    error,
    isSubmitting,
    updateDocument,
    updateDocumentForApproval,
    handleBack,
  } = useEditDocument(id);

  const {
    events,
    letters,
    periods,
    loading: formDataLoading,
    error: formDataError,
  } = useDocumentFormData();

  const combinedLoading = loading || formDataLoading || isSubmitting;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Document" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : document ? (
        <DocumentForm
          document={document}
          onSubmit={updateDocument}
          onSubmitForApproval={updateDocumentForApproval}
          events={events}
          letters={letters}
          periods={periods}
          loading={combinedLoading}
          isEditing={false}
        />
      ) : null}
    </div>
  );
}
