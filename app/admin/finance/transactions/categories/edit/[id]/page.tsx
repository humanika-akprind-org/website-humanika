"use client";

import { useParams } from "next/navigation";
import FinanceCategoryForm from "@/presentation/components/admin/pages/finance/category/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useEditFinanceCategory } from "@/presentation/hooks/finance-category/useEditFinanceCategory";

export default function EditFinanceCategoryPage() {
  const params = useParams();
  const categoryId = params.id as string;

  const { category, loading, error, updateFinanceCategory, handleBack } =
    useEditFinanceCategory(categoryId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Finance Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {loading ? (
        <LoadingForm />
      ) : category ? (
        <FinanceCategoryForm
          category={category}
          onSubmit={updateFinanceCategory}
        />
      ) : null}
    </div>
  );
}
