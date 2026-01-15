"use client";

import { useRouter, useParams } from "next/navigation";
import { useEffect, useState } from "react";
import StatisticForm, {
  type StatisticFormData,
} from "@/components/admin/pages/statistic/Form";
import LoadingForm from "components/admin/layout/loading/LoadingForm";
import Alert from "components/admin/ui/alert/Alert";
import PageHeader from "components/admin/ui/PageHeader";
import { useStatisticManagement } from "hooks/statistic/useStatisticManagement";
import { usePeriods } from "@/hooks/period/usePeriods";

export default function EditStatisticPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    statistics,
    loading: isLoadingData,
    handleUpdateStatistic,
    error,
    success,
  } = useStatisticManagement();
  const {
    periods,
    loading: isLoadingPeriods,
    error: formDataError,
  } = usePeriods();

  const [localError, setLocalError] = useState<string | null>(null);

  const statistic = statistics.find((s) => s.id === id);

  useEffect(() => {
    if (!isLoadingData && !isLoadingPeriods && !statistic) {
      setLocalError("Statistic not found");
    }
  }, [isLoadingData, isLoadingPeriods, statistic]);

  const combinedLoading = isLoadingData || isLoadingPeriods;
  const loadError = error || formDataError || localError;

  const handleBack = () => {
    router.push("/admin/content/statistics");
  };

  const handleSubmit = async (data: StatisticFormData) => {
    try {
      const result = await handleUpdateStatistic(id, data);
      if (result) {
        router.push("/admin/content/statistics");
      }
    } catch (err) {
      setLocalError((err as Error).message || "Failed to update statistic");
    }
  };

  const handleCancel = () => {
    router.push("/admin/content/statistics");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader
        title={statistic ? "Edit Statistic" : "Edit Statistic"}
        onBack={handleBack}
      />

      {success && <Alert type="success" message={success} />}
      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : !statistic ? (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <Alert type="error" message="Statistic not found" />
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <StatisticForm
            initialData={statistic}
            onSubmit={handleSubmit}
            onCancel={handleCancel}
            loading={combinedLoading}
            periods={periods}
          />
        </div>
      )}
    </div>
  );
}
