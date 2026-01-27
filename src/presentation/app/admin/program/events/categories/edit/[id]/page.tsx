"use client";

import { useParams } from "next/navigation";
import EventCategoryForm from "@/src/presentation/components/admin/pages/event/category/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useEditEventCategory } from "@/src/presentation/hooks/event-category/useEditEventCategory";

export default function EditEventCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { category, loading, error, updateEventCategory, handleBack } =
    useEditEventCategory(categoryId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Event Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingForm />
      ) : category ? (
        <EventCategoryForm category={category} onSubmit={updateEventCategory} />
      ) : null}
    </div>
  );
}
