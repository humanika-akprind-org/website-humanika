"use client";

import GalleryCategoryForm from "@/src/presentation/components/admin/pages/gallery/category/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateGalleryCategory } from "@/src/presentation/hooks/gallery-category/useCreateGalleryCategory";

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
