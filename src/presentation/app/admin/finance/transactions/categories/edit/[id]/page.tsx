"use client";

import { useParams } from "next/navigation";
import FinanceCategoryForm from "@/src/presentation/components/admin/pages/finance/category/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useEditFinanceCategory } from "@/src/presentation/hooks/finance-category/useEditFinanceCategory";

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
