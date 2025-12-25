"use client";

import FinanceForm from "@/components/admin/finance/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateFinance } from "@/hooks/finance/useCreateFinance";
import { useFinanceFormData } from "@/hooks/finance/useFinanceFormData";
export default function AddFinancePage() {
  const {
    createFinance,
    createFinanceForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  } = useCreateFinance();

  const {
    categories,
    workPrograms,
    loading: formDataLoading,
    error: formDataError,
  } = useFinanceFormData();

  const combinedLoading = isSubmitting || isLoading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Transaction" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <FinanceForm
          categories={categories}
          workPrograms={workPrograms}
          onSubmit={createFinance}
          onSubmitForApproval={createFinanceForApproval}
          isLoading={combinedLoading}
        />
      )}
    </div>
  );
}
