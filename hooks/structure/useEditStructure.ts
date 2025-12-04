import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { StructureApi } from "@/use-cases/api/structure";
import type {
  OrganizationalStructure,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";

type AlertType = "error" | "success" | "warning" | "info";

export function useEditStructure(structureId: string) {
  const router = useRouter();
  const [structure, setStructure] = useState<OrganizationalStructure | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);

  useEffect(() => {
    const fetchStructure = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await StructureApi.getStructure(structureId);
        if (response.error) {
          setError(response.error);
        } else if (response.data) {
          setStructure(response.data);
        }
      } catch (_error) {
        setError("Failed to fetch structure data");
      } finally {
        setLoading(false);
      }
    };

    fetchStructure();
  }, [structureId]);

  const handleSubmit = async (formData: UpdateOrganizationalStructureInput) => {
    try {
      setAlert(null);
      await StructureApi.updateStructure(structureId, formData);
      setAlert({ type: "success", message: "Structure updated successfully" });
      router.push("/admin/governance/structure");
    } catch (error) {
      console.error("Update error:", error);
      setAlert({
        type: "error",
        message: "Failed to update structure. Please try again.",
      });
    }
  };

  const handleDelete = async () => {
    try {
      setAlert(null);
      await StructureApi.deleteStructure(structureId);
      setAlert({ type: "success", message: "Structure deleted successfully" });
      router.push("/admin/governance/structure");
    } catch (error) {
      console.error("Delete error:", error);
      setAlert({
        type: "error",
        message: "Failed to delete structure. Please try again.",
      });
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    structure,
    loading,
    error,
    alert,
    handleSubmit,
    handleDelete,
    handleBack,
  };
}
