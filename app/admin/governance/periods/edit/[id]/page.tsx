"use client";

import { useParams } from "next/navigation";
import PeriodForm from "@/components/admin/pages/period/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import Alert from "@/components/admin/ui/alert/Alert";
import PageHeader from "@/components/admin/ui/PageHeader";
import { useEditPeriod } from "@/hooks/period/useEditPeriod";

export default function EditPeriodPage() {
  const params = useParams();
  const periodId = params.id as string;

  const { period, loading, error, alert, handleSubmit, handleBack } =
    useEditPeriod(periodId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Period" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {loading ? (
        <LoadingForm />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : period ? (
        <PeriodForm period={period} onSubmit={handleSubmit} isEdit={true} />
      ) : null}
    </div>
  );
}
