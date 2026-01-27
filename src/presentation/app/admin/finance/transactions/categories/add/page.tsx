"use client";

import FinanceCategoryForm from "@/src/presentation/components/admin/pages/finance/category/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateFinanceCategory } from "@/src/presentation/hooks/finance-category/useCreateFinanceCategory";

export default function AddFinanceCategoryPage() {
  const { createFinanceCategory, handleBack, isSubmitting, error, isLoading } =
    useCreateFinanceCategory();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Finance Category" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting || isLoading ? (
        <LoadingForm />
      ) : (
        <FinanceCategoryForm onSubmit={createFinanceCategory} />
      )}
    </div>
  );
}
