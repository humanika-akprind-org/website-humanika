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
import { MissionItem } from "@/components/admin/ui/input/MissionArrayInput";

interface InitialData {
  vision: string;
  mission: MissionItem[];
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
          // Normalize mission to MissionItem array
          const missionData = data.mission;
          let missionArray: MissionItem[] = [];

          if (Array.isArray(missionData)) {
            missionArray = missionData.map((m) => {
              if (typeof m === "string") {
                // Convert legacy string format to MissionItem
                // Format expected: "Title - Description"
                const dashIndex = m.indexOf(" - ");
                if (dashIndex > 0) {
                  return {
                    icon: "",
                    title: m.substring(0, dashIndex).trim(),
                    description: m.substring(dashIndex + 3).trim(),
                  };
                }
                return { icon: "", title: m.trim(), description: "" };
              }
              // Already a MissionItem object
              return m as MissionItem;
            });
          } else if (typeof missionData === "string" && missionData) {
            // Single string legacy format
            const dashIndex = missionData.indexOf(" - ");
            if (dashIndex > 0) {
              missionArray = [
                {
                  icon: "",
                  title: missionData.substring(0, dashIndex).trim(),
                  description: missionData.substring(dashIndex + 3).trim(),
                },
              ];
            } else {
              missionArray = [
                { icon: "", title: missionData.trim(), description: "" },
              ];
            }
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
