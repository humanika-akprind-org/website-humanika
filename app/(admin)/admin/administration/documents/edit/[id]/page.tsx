"use client";

import { useParams } from "next/navigation";
import DocumentForm from "@/components/admin/document/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useEditDocument } from "@/hooks/document/useEditDocument";
import { useDocumentFormData } from "@/hooks/document/useDocumentFormData";
import { useState, useEffect } from "react";

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
    loading: formDataLoading,
    error: formDataError,
  } = useDocumentFormData();

  const [accessToken, setAccessToken] = useState<string>("");

  useEffect(() => {
    const fetchToken = async () => {
      try {
        // Assuming there's an API endpoint to get the access token client-side
        const response = await fetch("/api/auth/google-access-token");
        if (response.ok) {
          const data = await response.json();
          setAccessToken(data.accessToken || "");
        }
      } catch (e) {
        console.error("Failed to fetch access token:", e);
      }
    };
    fetchToken();
  }, []);

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
          accessToken={accessToken}
          events={events}
          letters={letters}
          loading={combinedLoading}
        />
      ) : null}
    </div>
  );
}
