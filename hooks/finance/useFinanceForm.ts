import { useState, useEffect } from "react";
import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/types/finance";
import { FinanceType, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { financeFolderId } from "@/lib/config/config";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import type { FinanceCategory } from "@/types/finance-category";
import type { Event } from "@/types/event";

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string): boolean => {
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

// Helper function to get preview URL from proof (file ID or URL)
const getPreviewUrl = (proof: string | null | undefined): string | null => {
  if (!proof) return null;

  if (proof.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = proof.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return proof;
  } else if (proof.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `/api/drive-image?fileId=${proof}`;
  } else {
    // It's a direct URL or other format
    return proof;
  }
};

// Helper function to check if proof is from Google Drive (either URL or file ID)
const isGoogleDriveProof = (proof: string | null | undefined): boolean => {
  if (!proof) return false;
  return (
    proof.includes("drive.google.com") ||
    proof.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from proof (either URL or file ID)
const getFileIdFromProof = (
  proof: string | null | undefined
): string | null => {
  if (!proof) return null;

  if (proof.includes("drive.google.com")) {
    const fileIdMatch = proof.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (proof.match(/^[a-zA-Z0-9_-]+$/)) {
    return proof;
  }
  return null;
};

interface UseFinanceFormProps {
  finance?: Finance;
  onSubmit: (data: CreateFinanceInput | UpdateFinanceInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateFinanceInput | UpdateFinanceInput
  ) => Promise<void>;
  accessToken: string;
  users: User[];
  periods: Period[];
  categories: FinanceCategory[];
  events: Event[];
}

export const useFinanceForm = ({
  finance,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  users: _users,
  periods: _periods,
  categories: _categories,
  events: _events,
}: UseFinanceFormProps) => {
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    name: finance?.name || "",
    description: finance?.description || "",
    amount: finance?.amount || 0,
    date: finance?.date
      ? new Date(finance.date).toISOString().split("T")[0]
      : "",
    categoryId: finance?.categoryId || "",
    type: finance?.type || FinanceType.EXPENSE,
    periodId: finance?.periodId || "",
    eventId: finance?.eventId || "",
    status: finance?.status || Status.DRAFT,
    proofFile: undefined as File | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingProof, setExistingProof] = useState<string | null | undefined>(
    finance?.proof
  );
  const [removedProof, setRemovedProof] = useState(false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize preview URL when component mounts with existing data
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(finance?.proof));
  }, [finance?.proof]);

  // Update preview URL when existingProof changes
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingProof));
  }, [existingProof]);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validasi file
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, proofFile: file }));
      setError(null);

      // Create preview URL
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRemovedProof(false); // Reset removed state when new file is selected
    }
  };

  const removeProof = () => {
    if (isGoogleDriveProof(existingProof)) {
      // Mark proof as removed for deletion during form submission
      setRemovedProof(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, proofFile: undefined }));
    setPreviewUrl(null);
    setExistingProof(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter transaction name");
      }
      if (isHtmlEmpty(formData.description)) {
        throw new Error("Please enter description");
      }
      if (formData.amount <= 0) {
        throw new Error("Amount must be greater than 0");
      }
      if (!formData.categoryId) {
        throw new Error("Please select a category");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }
      if (!formData.date) {
        throw new Error("Please select date");
      }

      // Handle proof deletion if marked for removal
      let proofUrl: string | null | undefined = existingProof;

      if (removedProof) {
        // Delete from Google Drive and set proofUrl to null
        if (finance?.proof && isGoogleDriveProof(finance.proof)) {
          const fileId = getFileIdFromProof(finance.proof);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete proof:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        proofUrl = null;
      }

      if (formData.proofFile) {
        // Delete old proof from Google Drive if it exists and wasn't already removed
        if (
          !removedProof &&
          finance?.proof &&
          isGoogleDriveProof(finance.proof)
        ) {
          const fileId = getFileIdFromProof(finance.proof);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old proof:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.proofFile,
          tempFileName,
          financeFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `finance-proof-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              proofUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for proof");
            }
          } else {
            throw new Error("Failed to rename proof");
          }
        } else {
          throw new Error("Failed to upload proof");
        }
      }

      // Submit form data with proof URL (exclude proofFile for server action)
      const { proofFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        proof: proofUrl,
        date: new Date(formData.date),
        eventId:
          formData.eventId && formData.eventId.trim() !== ""
            ? formData.eventId
            : undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedProof(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save transaction"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingProof,
    photoLoading,
    handleInputChange,
    handleFileChange,
    removeProof,
    handleSubmit,
  };
};
