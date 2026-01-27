"use client";

import PeriodForm from "@/src/presentation/components/admin/pages/period/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreatePeriod } from "@/src/presentation/hooks/period/useCreatePeriod";

export default function AddPeriodPage() {
  const { createPeriod, handleBack, isSubmitting, error } = useCreatePeriod();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Period" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? <LoadingForm /> : <PeriodForm onSubmit={createPeriod} />}
    </div>
  );
}
