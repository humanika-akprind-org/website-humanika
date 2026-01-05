"use client";

import PeriodForm from "@/components/admin/pages/period/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreatePeriod } from "@/hooks/period/useCreatePeriod";

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
