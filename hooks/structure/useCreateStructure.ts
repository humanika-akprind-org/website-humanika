import { useState } from "react";
import { useRouter } from "next/navigation";
import { StructureApi } from "@/use-cases/api/structure";
import type {
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";

export function useCreateStructure() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createStructure = async (
    formData: UpdateOrganizationalStructureInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      // Cast to CreateOrganizationalStructureInput since name is required for creation
      await StructureApi.createStructure(
        formData as CreateOrganizationalStructureInput
      );
      router.push("/admin/governance/structure");
    } catch (err) {
      console.error("Submission error:", err);
      setError("Failed to create structure. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.back();
  };

  return {
    createStructure,
    isSubmitting,
    error,
    setError,
    handleBack,
  };
}
