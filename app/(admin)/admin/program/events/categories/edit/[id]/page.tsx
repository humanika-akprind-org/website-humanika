"use client";

import { useParams } from "next/navigation";
import EventCategoryForm from "@/components/admin/pages/event/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useEditEventCategory } from "@/hooks/event-category/useEditEventCategory";

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
