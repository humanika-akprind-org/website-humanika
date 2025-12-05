import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ManagementApi } from "@/use-cases/api/management";
import type { Management, ManagementServerData } from "@/types/management";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditManagement(managementId: string) {
  const router = useRouter();
  const [management, setManagement] = useState<Management | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchManagement = async () => {
      try {
        setLoading(true);
        setError(null);
        const managementData = await ManagementApi.getManagement(managementId);
        setManagement(managementData);
      } catch (_error) {
        setError("Failed to fetch management data");
      } finally {
        setLoading(false);
      }
    };

    fetchManagement();
  }, [managementId]);

  const handleSubmit = async (formData: ManagementServerData) => {
    try {
      setAlert(null);
      await ManagementApi.updateManagement(managementId, formData);
      setAlert({ type: "success", message: "Management updated successfully" });
      router.push("/admin/governance/managements");
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        type: "error",
        message: "Failed to update management. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setAlert(null);
      await ManagementApi.deleteManagement(managementId);
      setAlert({ type: "success", message: "Management deleted successfully" });
      router.push("/admin/governance/managements");
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({
        type: "error",
        message: "Failed to delete management. Please try again.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    management,
    loading,
    error,
    alert,
    handleSubmit,
    handleDelete,
    handleBack,
  };
}
