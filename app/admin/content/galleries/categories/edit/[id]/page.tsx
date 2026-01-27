"use client";

import { useParams } from "next/navigation";
import GalleryCategoryForm from "@/presentation/components/admin/pages/gallery/category/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useEditGalleryCategory } from "@/presentation/hooks/gallery-category/useEditGalleryCategory";

export default function EditGalleryCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { category, loading, error, updateGalleryCategory, handleBack } =
    useEditGalleryCategory(categoryId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Gallery Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingForm />
      ) : category ? (
        <GalleryCategoryForm
          category={category}
          onSubmit={updateGalleryCategory}
        />
      ) : null}
    </div>
  );
}
