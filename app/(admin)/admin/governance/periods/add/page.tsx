"use client";

import PeriodForm from "@/components/admin/period/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import { useCreatePeriod } from "@/hooks/period/useCreatePeriod";

export default function AddPeriodPage() {
  const { isSubmitting } = useCreatePeriod();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {isSubmitting ? <LoadingForm /> : <PeriodForm />}
    </div>
  );
}
