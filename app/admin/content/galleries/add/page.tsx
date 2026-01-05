"use client";

import GalleryForm from "@/components/admin/pages/gallery/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateGallery } from "@/hooks/gallery/useCreateGallery";
import { useGalleryFormData } from "@/hooks/gallery/useGalleryFormData";

export default function AddGalleryPage() {
  const { createGallery, handleBack, isSubmitting, error, isLoading } =
    useCreateGallery();

  const {
    events,
    loading: formDataLoading,
    error: formDataError,
  } = useGalleryFormData();

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Gallery" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <GalleryForm
          onSubmit={createGallery}
          events={events}
          loading={combinedLoading}
        />
      )}
    </div>
  );
}
