// app/(admin)/admin/governance/managements/add/page.tsx
"use client";

import ManagementForm from "@/src/presentation/components/admin/pages/management/Form";
import LoadingForm from "@/src/presentation/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/src/presentation/components/admin/ui/PageHeader";
import Alert from "@/src/presentation/components/admin/ui/alert/Alert";
import { useCreateManagement } from "@/src/presentation/hooks/management/useCreateManagement";

export default function AddManagementPage() {
  const { createManagement, handleBack, isSubmitting, error } =
    useCreateManagement();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Profile Management" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? (
        <LoadingForm />
      ) : (
        <ManagementForm onSubmit={createManagement} />
      )}
    </div>
  );
}
