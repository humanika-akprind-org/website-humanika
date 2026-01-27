"use client";

import FinanceForm from "@/presentation/components/admin/pages/finance/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useCreateFinance } from "@/presentation/hooks/finance/useCreateFinance";
import { useFinanceFormData } from "@/presentation/hooks/finance/useFinanceFormData";
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
    periods,
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
          periods={periods}
          onSubmit={createFinance}
          onSubmitForApproval={createFinanceForApproval}
          isLoading={combinedLoading}
        />
      )}
    </div>
  );
}
