"use client";

import { useParams } from "next/navigation";
import FinanceForm from "@/presentation/components/admin/pages/finance/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import { useEditFinance } from "@/presentation/hooks/finance/useEditFinance";
import { useFinanceFormData } from "@/presentation/hooks/finance/useFinanceFormData";

export default function EditFinancePage() {
  const params = useParams();
  const financeId = params.id as string;

  const { finance, loading, error, updateFinance, handleBack } =
    useEditFinance(financeId);

  const {
    categories,
    workPrograms,
    periods,
    loading: formDataLoading,
    error: formDataError,
  } = useFinanceFormData();

  const isLoading = loading || formDataLoading;
  const loadError = error || formDataError;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Transaction" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {isLoading ? (
        <LoadingForm />
      ) : finance ? (
        <FinanceForm
          finance={finance}
          onSubmit={updateFinance}
          categories={categories}
          workPrograms={workPrograms}
          periods={periods}
          isEditing={true}
        />
      ) : null}
    </div>
  );
}
