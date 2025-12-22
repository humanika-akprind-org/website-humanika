"use client";

import DocumentTypeForm from "@/components/admin/document/type/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateDocumentType } from "@/hooks/document-type/useCreateDocumentType";

export default function AddDocumentTypePage() {
  const { createDocumentType, handleBack, isSubmitting, error } =
    useCreateDocumentType();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Document Type" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? (
        <LoadingForm />
      ) : (
        <DocumentTypeForm onSubmit={createDocumentType} />
      )}
    </div>
  );
}
