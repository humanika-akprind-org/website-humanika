"use client";

import GalleryCategoryForm from "@/presentation/components/admin/pages/gallery/category/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useCreateGalleryCategory } from "@/presentation/hooks/gallery-category/useCreateGalleryCategory";

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
