"use client";

import DocumentForm from "@/components/admin/document/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateDocument } from "@/hooks/document/useCreateDocument";
import { useDocumentFormData } from "@/hooks/document/useDocumentFormData";
import { useState, useEffect } from "react";

export default function AddDocumentPage() {
  const {
    createDocument,
    createDocumentForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  } = useCreateDocument();

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

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Document" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <DocumentForm
          onSubmit={createDocument}
          onSubmitForApproval={createDocumentForApproval}
          accessToken={accessToken}
          events={events}
          letters={letters}
          loading={combinedLoading}
        />
      )}
    </div>
  );
}
