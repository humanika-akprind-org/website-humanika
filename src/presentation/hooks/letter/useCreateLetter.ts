import { useState } from "react";
import { useRouter } from "next/navigation";
import type {
  CreateLetterInput,
  UpdateLetterInput,
} from "@/domain/entities/letter.entity";
import { LetterApi } from "@/presentation/services/letter";
import { Status } from "@/domain/enums/status.enum";
import { LetterType, LetterPriority } from "@/domain/enums";

export function useCreateLetter() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, _setIsLoading] = useState(false);

  const createLetter = async (data: CreateLetterInput | UpdateLetterInput) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateLetterInput = {
        number: data.number ?? undefined,
        regarding: data.regarding ?? "",
        origin: data.origin ?? "",
        destination: data.destination ?? "",
        classification: data.classification ?? undefined,
        date: data.date ?? new Date(),
        type: data.type ?? LetterType.OUTGOING,
        priority: data.priority ?? LetterPriority.NORMAL,
        body: data.body ?? undefined,
        letter: data.letter ?? undefined,
        notes: data.notes ?? undefined,
        periodId: data.periodId ?? undefined,
        eventId: data.eventId ?? undefined,
        status: Status.DRAFT,
      };
      await LetterApi.createLetter(input);
      router.push("/admin/administration/letters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const createLetterForApproval = async (
    data: CreateLetterInput | UpdateLetterInput,
  ) => {
    setIsSubmitting(true);
    setError(null);
    try {
      // Build input with required fields, using defaults for optional missing fields
      const input: CreateLetterInput = {
        number: data.number ?? undefined,
        regarding: data.regarding ?? "",
        origin: data.origin ?? "",
        destination: data.destination ?? "",
        classification: data.classification ?? undefined,
        date: data.date ?? new Date(),
        type: data.type ?? LetterType.OUTGOING,
        priority: data.priority ?? LetterPriority.NORMAL,
        body: data.body ?? undefined,
        letter: data.letter ?? undefined,
        notes: data.notes ?? undefined,
        periodId: data.periodId ?? undefined,
        eventId: data.eventId ?? undefined,
        status: Status.PENDING,
      };
      await LetterApi.createLetter(input);
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
