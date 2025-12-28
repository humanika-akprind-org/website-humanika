"use client";

import FinanceCategoryForm from "@/components/admin/finance/category/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateFinanceCategory } from "@/hooks/finance-category/useCreateFinanceCategory";

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
