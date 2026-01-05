// app/(admin)/admin/governance/managements/add/page.tsx
"use client";

import ManagementForm from "@/components/admin/pages/management/Form";
import LoadingForm from "@/components/admin/layout/loading/LoadingForm";
import PageHeader from "@/components/admin/ui/PageHeader";
import Alert from "@/components/admin/ui/alert/Alert";
import { useCreateManagement } from "@/hooks/management/useCreateManagement";

export default function AddManagementPage() {
  const { createManagement, handleBack, isSubmitting, error } =
    useCreateManagement();

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add New Management" onBack={handleBack} />

      {error && <Alert type="error" message={error} />}

      {isSubmitting ? (
        <LoadingForm />
      ) : (
        <ManagementForm onSubmit={createManagement} />
      )}
    </div>
  );
}
