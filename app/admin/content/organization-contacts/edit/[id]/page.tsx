"use client";

import { useRouter, useParams } from "next/navigation";
import { useState, useEffect } from "react";
import OrganizationContactForm, {
  type OrganizationContactFormData,
} from "@/components/admin/pages/organization-contact/Form";
import LoadingForm from "components/admin/layout/loading/LoadingForm";
import Alert from "components/admin/ui/alert/Alert";
import PageHeader from "components/admin/ui/PageHeader";
import { useOrganizationContactManagement } from "hooks/organization-contact/useOrganizationContactManagement";
import { usePeriods } from "@/hooks/period/usePeriods";
import { getOrganizationContact } from "@/use-cases/api/organization-contact";

interface InitialData {
  vision: string;
  mission: string[];
  phone?: string;
  email: string;
  address: string;
  periodId: string;
}

export default function EditOrganizationContactPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const {
    handleUpdateOrganizationContact,
    loading: isSubmitting,
    error,
    success,
  } = useOrganizationContactManagement();
  const { periods, loading: isLoading, error: formDataError } = usePeriods();

  const [initialData, setInitialData] = useState<InitialData | null>(null);
  const [fetchError, setFetchError] = useState<string | null>(null);

  const combinedLoading = isSubmitting || isLoading;
  const loadError = error || formDataError || fetchError;

  const handleBack = () => {
    router.push("/admin/content/organization-contacts");
  };

  useEffect(() => {
    const fetchOrganizationContact = async () => {
      try {
        const data = await getOrganizationContact(id);
        if (data) {
          // Normalize mission to string array
          const missionData = data.mission;
          let missionArray: string[] = [];

          if (Array.isArray(missionData)) {
            missionArray = missionData.filter(
              (m): m is string => typeof m === "string"
            );
          } else if (typeof missionData === "string" && missionData) {
            missionArray = [missionData];
          }

          setInitialData({
            vision: data.vision,
            mission: missionArray,
            phone: data.phone || undefined,
            email: data.email,
            address: data.address,
            periodId: data.periodId,
          });
        } else {
          setFetchError("Organization contact not found");
        }
      } catch (err) {
        setFetchError(
          err instanceof Error
            ? err.message
            : "Failed to fetch organization contact"
        );
      }
    };

    if (id) {
      fetchOrganizationContact();
    }
  }, [id]);

  const handleSubmit = async (data: OrganizationContactFormData) => {
    const result = await handleUpdateOrganizationContact(id, data);
    if (result) {
      router.push("/admin/content/organization-contacts");
    }
  };

  const handleCancel = () => {
    router.push("/admin/content/organization-contacts");
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <PageHeader title="Edit Organization Contact" onBack={handleBack} />

      {success && <Alert type="success" message={success} />}
      {loadError && <Alert type="error" message={loadError} />}

      {combinedLoading ? (
        <LoadingForm />
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
          {initialData ? (
            <OrganizationContactForm
              initialData={initialData}
              onSubmit={handleSubmit}
              onCancel={handleCancel}
              loading={combinedLoading}
              periods={periods}
            />
          ) : (
            !loadError && <LoadingForm />
          )}
        </div>
      )}
    </div>
  );
}
