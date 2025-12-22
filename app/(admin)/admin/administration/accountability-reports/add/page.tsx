"use client";

import DocumentForm from "@/components/admin/document/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import WarningModal from "@/components/admin/ui/modal/WarningModal";
import { useCreateDocument } from "@/hooks/document/useCreateDocument";
import { useDocumentFormData } from "@/hooks/document/useDocumentFormData";
import { useDocumentTypes } from "@/hooks/document-type/useDocumentTypes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AddDocumentPage() {
  const router = useRouter();
  const [showWarningModal, setShowWarningModal] = useState(false);

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

  const {
    documentTypes,
    isLoading: documentTypesLoading,
    error: documentTypesError,
  } = useDocumentTypes();

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

  // Check if ACCOUNTABILITY-REPORT document type exists
  useEffect(() => {
    if (!documentTypesLoading && documentTypes.length > 0) {
      const accountabilityReportType = documentTypes.find(
        (type) =>
          type.name.toLowerCase().replace(/[\s\-]/g, "") ===
          "accountabilityreport"
      );
      if (!accountabilityReportType) {
        setShowWarningModal(true);
      }
    }
  }, [documentTypes, documentTypesLoading]);

  const combinedLoading =
    isSubmitting || isLoading || formDataLoading || documentTypesLoading;
  const loadError = error || formDataError || documentTypesError;

  const handleRedirectToAddType = () => {
    router.push("/admin/administration/documents/types/add");
  };

  // Check if ACCOUNTABILITY-REPORT document type exists
  const accountabilityReportType = documentTypes.find(
    (type) =>
      type.name.toLowerCase().replace(/[\s\-]/g, "") === "accountabilityreport"
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Accountability" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : accountabilityReportType ? (
        <DocumentForm
          onSubmit={createDocument}
          onSubmitForApproval={createDocumentForApproval}
          accessToken={accessToken}
          events={events}
          letters={letters}
          loading={combinedLoading}
          fixedDocumentType="accountabilityreport"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-600">
            Document type ACCOUNTABILITY REPORT is required to add
            accountability reports.
          </p>
        </div>
      )}

      <WarningModal
        isOpen={showWarningModal}
        title="Document Type Not Found"
        message="Document type ACCOUNTABILITY REPORT tidak ada, tambahkan terlebih dahulu"
        onClose={() => setShowWarningModal(false)}
        onRedirect={handleRedirectToAddType}
        redirectText="Add Document Type"
      />
    </div>
  );
}
