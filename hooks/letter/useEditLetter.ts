import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type { UpdateLetterInput, Letter } from "@/types/letter";

export function useEditLetter(id: string) {
  const router = useRouter();
  const [letter, setLetter] = useState<Letter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchLetter = async () => {
      try {
        const response = await fetch(`/api/letter/${id}`);
        if (!response.ok) throw new Error("Failed to fetch letter");
        const data = await response.json();
        setLetter(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unknown error");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchLetter();
  }, [id]);

  const updateLetter = async (data: UpdateLetterInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const response = await fetch(`/api/letter/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error("Failed to update letter");
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
    letter,
    loading,
    error,
    isSubmitting,
    updateLetter,
    handleBack,
  };
}
