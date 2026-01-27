"use client";

import GalleryForm from "@/presentation/components/admin/pages/gallery/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useCreateGallery } from "@/presentation/hooks/gallery/useCreateGallery";
import { useGalleryFormData } from "@/presentation/hooks/gallery/useGalleryFormData";

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
