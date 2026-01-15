"use client";

import { useRouter } from "next/navigation";
import StatisticForm, {
  type StatisticFormData,
} from "@/components/admin/pages/statistic/Form";
import LoadingForm from "components/admin/layout/loading/LoadingForm";
import Alert from "components/admin/ui/alert/Alert";
import PageHeader from "components/admin/ui/PageHeader";
import { useStatisticManagement } from "hooks/statistic/useStatisticManagement";
import { usePeriods } from "@/hooks/period/usePeriods";

export default function AddStatisticPage() {
  const router = useRouter();
  const {
    handleCreateStatistic,
    loading: isSubmitting,
    error,
    success,
  } = useStatisticManagement();
  const { periods, loading: isLoading, error: formDataError } = usePeriods();

  const combinedLoading = isSubmitting || isLoading;
  const loadError = error || formDataError;

  const handleBack = () => {
    router.push("/admin/content/statistics");
  };

  const handleSubmit = async (data: StatisticFormData) => {
    const result = await handleCreateStatistic(data);
    if (result) {
      router.push("/admin/content/statistics");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add Statistic" onBack={handleBack} />

      {success && <Alert type="success" message={success} />}
      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <StatisticForm
            onSubmit={handleSubmit}
            loading={combinedLoading}
            periods={periods}
          />
        </div>
      )}
    </div>
  );
}
