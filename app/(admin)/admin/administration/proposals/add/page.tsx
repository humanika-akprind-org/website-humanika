"use client";

import DocumentForm from "@/components/admin/document/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateDocument } from "@/hooks/document/useCreateDocument";
import { useDocumentFormData } from "@/hooks/document/useDocumentFormData";
import { useDocumentTypes } from "@/hooks/document-type/useDocumentTypes";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import WarningModal from "@/components/admin/ui/modal/WarningModal";

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

  const { documentTypes, isLoading: documentTypesLoading } = useDocumentTypes();

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

  // Check if PROPOSAL document type exists
  useEffect(() => {
    if (!documentTypesLoading && documentTypes.length > 0) {
      const proposalType = documentTypes.find(
        (type) => type.name.toLowerCase().replace(/[\s\-]/g, "") === "proposal"
      );
      if (!proposalType) {
        setShowWarningModal(true);
      }
    }
  }, [documentTypes, documentTypesLoading]);

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  const handleRedirectToAddType = () => {
    router.push("/admin/administration/documents/types/add");
  };

  // Check if PROPOSAL document type exists
  const proposalType = documentTypes.find(
    (type) => type.name.toLowerCase().replace(/[\s\-]/g, "") === "proposal"
  );

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Proposal" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : proposalType ? (
        <DocumentForm
          onSubmit={createDocument}
          onSubmitForApproval={createDocumentForApproval}
          accessToken={accessToken}
          events={events}
          letters={letters}
          loading={combinedLoading}
          fixedDocumentType="proposal"
        />
      ) : (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 text-center">
          <p className="text-gray-600">
            Document type PROPOSAL is required to add proposals.
          </p>
        </div>
      )}

      <WarningModal
        isOpen={showWarningModal}
        title="Document Type Not Found"
        message="Document type PROPOSAL tidak ada, tambahkan terlebih dahulu"
        onClose={() => setShowWarningModal(false)}
        onRedirect={handleRedirectToAddType}
        redirectText="Add Document Type"
      />
    </div>
  );
}
