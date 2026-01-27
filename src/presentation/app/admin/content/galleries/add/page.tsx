"use client";

import GalleryForm from "@/src/presentation/components/admin/pages/gallery/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateGallery } from "@/src/presentation/hooks/gallery/useCreateGallery";
import { useGalleryFormData } from "@/src/presentation/hooks/gallery/useGalleryFormData";

export default function AddGalleryPage() {
  const { createGallery, handleBack, isSubmitting, error, isLoading } =
    useCreateGallery();

  const {
    events,
    periods,
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
          periods={periods}
          loading={combinedLoading}
        />
      )}
    </div>
  );
}
