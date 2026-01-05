"use client";

import GalleryCategoryForm from "@/components/admin/pages/gallery/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateGalleryCategory } from "@/hooks/gallery-category/useCreateGalleryCategory";

export default function AddGalleryCategoryPage() {
  const { createGalleryCategory, handleBack, isSubmitting, error, isLoading } =
    useCreateGalleryCategory();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Gallery Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting || isLoading ? (
        <LoadingForm />
      ) : (
        <GalleryCategoryForm onSubmit={createGalleryCategory} />
      )}
    </div>
  );
}
