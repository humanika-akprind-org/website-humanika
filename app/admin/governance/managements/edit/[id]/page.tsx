"use client";

import { useParams } from "next/navigation";
import ManagementForm from "@/presentation/components/admin/pages/management/Form";
import LoadingForm from "@/presentation/components/admin/layout/loading/LoadingForm";
import Alert from "@/presentation/components/admin/ui/alert/Alert";
import PageHeader from "@/presentation/components/admin/ui/PageHeader";
import { useEditManagement } from "@/presentation/hooks/management/useEditManagement";

export default function EditManagementPage() {
  const params = useParams();
  const managementId = params.id as string;

  const { management, loading, error, alert, handleSubmit, handleBack } =
    useEditManagement(managementId);

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Profile Management" onBack={handleBack} />

      {alert && <Alert type={alert.type} message={alert.message} />}

      {loading ? (
        <LoadingForm />
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : management ? (
        <ManagementForm
          management={management}
          onSubmit={handleSubmit}
          isEdit={true}
        />
      ) : null}
    </div>
  );
}
