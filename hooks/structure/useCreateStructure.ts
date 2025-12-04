import { useState } from "react";
import { useRouter } from "next/navigation";
import { StructureApi } from "@/use-cases/api/structure";
import type { CreateOrganizationalStructureInput } from "@/types/structure";

export function useCreateStructure() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const createStructure = async (
    formData: CreateOrganizationalStructureInput
  ) => {
    setIsSubmitting(true);
    setError("");

    try {
      await StructureApi.createStructure(formData);
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
