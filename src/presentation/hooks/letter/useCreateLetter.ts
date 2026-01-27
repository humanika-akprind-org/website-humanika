import { useState } from "react";
import { useRouter } from "next/navigation";
import type { CreateLetterInput, UpdateLetterInput } from "@/types/letter";

export function useCreateLetter() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createLetter = async (data: CreateLetterInput | UpdateLetterInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "DRAFT",
        }),
      });
      if (!response.ok) throw new Error("Failed to create letter");
      router.push("/admin/administration/letters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createLetterForApproval = async (
    data: CreateLetterInput | UpdateLetterInput
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch("/api/letter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          status: "PENDING",
        }),
      });
      if (!response.ok) {
        throw new Error("Failed to create letter for approval");
      }
      router.push("/admin/administration/letters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleBack = () => {
    router.push("/admin/administration/letters");
  };

  return {
    createLetter,
    createLetterForApproval,
    handleBack,
    isSubmitting,
    error,
    isLoading,
  };
}
