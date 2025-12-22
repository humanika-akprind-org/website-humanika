"use client";

import { useParams } from "next/navigation";
import DocumentTypeForm from "@/components/admin/document/type/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useEditDocumentType } from "@/hooks/document-type/useEditDocumentType";

export default function EditDocumentTypePage() {
  const params = useParams();
  const documentTypeId = params.id as string;

  const { category, loading, error, updateDocumentType, handleBack } =
    useEditDocumentType(documentTypeId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Document Type" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingForm />
      ) : category ? (
        <DocumentTypeForm category={category} onSubmit={updateDocumentType} />
      ) : null}
    </div>
  );
}
