"use client";

import { useRouter } from "next/navigation";
import OrganizationContactForm, {
  type OrganizationContactFormData,
} from "@/components/admin/pages/organization-contact/Form";
import LoadingForm from "components/admin/layout/loading/LoadingForm";
import Alert from "components/admin/ui/alert/Alert";
import PageHeader from "components/admin/ui/PageHeader";
import { useOrganizationContactManagement } from "hooks/organization-contact/useOrganizationContactManagement";
import { usePeriods } from "@/hooks/period/usePeriods";

export default function AddOrganizationContactPage() {
  const router = useRouter();
  const {
    handleCreateOrganizationContact,
    loading: isSubmitting,
    error,
  } = useOrganizationContactManagement();
  const { periods, loading: isLoading, error: formDataError } = usePeriods();

  const combinedLoading = isSubmitting || isLoading;
  const loadError = error || formDataError;

  const handleBack = () => {
    router.push("/admin/content/organization-contacts");
  };

  const handleSubmit = async (data: OrganizationContactFormData) => {
    const result = await handleCreateOrganizationContact(data);
    if (result) {
      router.push("/admin/content/organization-contacts");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Add Organization Contact" onBack={handleBack} />

      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          <OrganizationContactForm
            onSubmit={handleSubmit}
            loading={combinedLoading}
            periods={periods}
          />
        </div>
      )}
    </div>
  );
}
