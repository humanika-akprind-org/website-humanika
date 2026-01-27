"use client";

import DocumentTypeForm from "@/src/presentation/components/admin/pages/document/type/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateDocumentType } from "@/src/presentation/hooks/document-type/useCreateDocumentType";

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
