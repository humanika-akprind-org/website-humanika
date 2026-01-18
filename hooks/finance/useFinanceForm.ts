import { useState, useEffect, useCallback } from "react";
import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/types/finance";
import { FinanceType, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { financeFolderId } from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import type { FinanceCategory } from "@/types/finance-category";
import { type WorkProgram } from "@/types/work";

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
  proof: string | null | undefined,
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
    data: CreateFinanceInput | UpdateFinanceInput,
  ) => Promise<void>;
  accessToken?: string;
  categories: FinanceCategory[];
  workPrograms: WorkProgram[];
}

export const useFinanceForm = ({
  finance,
  onSubmit,
  onSubmitForApproval,
  accessToken,
  categories: _categories,
  workPrograms: _workPrograms,
}: UseFinanceFormProps) => {
  const [fetchedAccessToken, setFetchedAccessToken] = useState<string>("");

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    getFileDetails,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken || fetchedAccessToken);

  // Fetch access token if not provided
  useEffect(() => {
    if (!accessToken) {
      const fetchAccessToken = async () => {
        const token = await getAccessTokenAction();
        setFetchedAccessToken(token);
      };
      fetchAccessToken();
    }
  }, [accessToken]);

  const [formData, setFormData] = useState({
    name: finance?.name || "",
    description: finance?.description || "",
    amount: finance?.amount || 0,
    date: finance?.date
      ? (() => {
          const date = new Date(finance.date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()
      : "",
    categoryId: finance?.categoryId || "",
    type: finance?.type || FinanceType.EXPENSE,
    workProgramId: finance?.workProgramId || "",
    periodId: finance?.periodId || "",
    status: finance?.status || Status.DRAFT,
    proofFile: undefined as File | undefined,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingProof, setExistingProof] = useState<string | null | undefined>(
    finance?.proof,
  );
  const [removedProof, setRemovedProof] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

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
      // Check if it's a 403 error with owner email info
      if (
        photoError.includes("permission") ||
        photoError.includes("Use email")
      ) {
        // Extract email from error message if present
        const emailMatch = photoError.match(/Use email\s+(.+?)\s+to/);
        if (emailMatch && emailMatch[1]) {
          setOwnerEmail(emailMatch[1]);
        }
      }
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
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
        setErrors((prev) => ({
          ...prev,
          proof: "File size must be less than 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          proof: "Please select an image file",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, proofFile: file }));
      setError(null);
      setErrors((prev) => ({ ...prev, proof: "" }));

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
    setOwnerEmail(null);

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Please enter transaction name";
    }
    if (isHtmlEmpty(formData.description)) {
      newErrors.description = "Please enter description";
    }
    if (formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    if (!formData.date) {
      newErrors.date = "Please select date";
    }
    if (!formData.proofFile && !existingProof) {
      newErrors.proof = "Please upload a proof image";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsSubmitting(false);
      return;
    }

    try {
      // Handle proof deletion if marked for removal
      let proofUrl: string | null | undefined = existingProof;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedProof && finance?.proof && isGoogleDriveProof(finance.proof)
          ? getFileIdFromProof(finance.proof)
          : null;

      // If user wants to remove the old proof or replace it, check ownership first
      if ((removedProof || formData.proofFile) && oldFileId) {
        // Try to delete the old file first to check ownership
        try {
          await deleteFile(oldFileId);
        } catch (err) {
          // Check if it's a 403 error (not owner or insufficient permissions)
          const errorMsg = err instanceof Error ? err.message : String(err);
          const isPermissionError =
            errorMsg.toLowerCase().includes("insufficient permissions") ||
            errorMsg.toLowerCase().includes("permission") ||
            errorMsg.includes("Use email");

          if (isPermissionError) {
            // Extract owner email from error object first, then from message
            const errWithOwner = err as Error & { ownerEmail?: string };
            const extractedEmail =
              errWithOwner.ownerEmail ||
              errorMsg.match(/Use email\s+(.+?)\s+to/)?.[1];
            setOwnerEmail(extractedEmail || null);
            throw new Error(
              extractedEmail
                ? `You don't have permission to modify this file. Use email ${extractedEmail} to edit or delete this proof.`
                : errorMsg,
            );
          }
          // For other errors, log but continue (non-critical)
          console.warn("Failed to delete old proof:", err);
        }
      }

      if (removedProof) {
        proofUrl = null;
      }

      if (formData.proofFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.proofFile,
          tempFileName,
          financeFolderId,
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
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded proof:", err);
            });
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
        date: (() => {
          // Parse YYYY-MM-DD format and create Date object without timezone issues
          const parts = formData.date.split("-");
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          // Create date at UTC midnight to avoid timezone shifts
          return new Date(Date.UTC(year, month, day));
        })(),
        workProgramId:
          formData.workProgramId && formData.workProgramId.trim() !== ""
            ? formData.workProgramId
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
        err instanceof Error ? err.message : "Failed to save transaction",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to get file owner when there's an existing proof
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingProof && isGoogleDriveProof(existingProof)) {
      const fileId = getFileIdFromProof(existingProof);
      if (fileId) {
        try {
          const ownerInfo = await getFileDetails(fileId, token);
          if (ownerInfo?.emailAddress) {
            setOwnerEmail(ownerInfo.emailAddress);
          }
        } catch (err) {
          console.warn("Failed to fetch file owner:", err);
        }
      }
    }
  }, [existingProof, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing proof
  useEffect(() => {
    if (existingProof) {
      fetchFileOwner();
    }
  }, [existingProof, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (fetchedAccessToken && existingProof) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, fetchFileOwner, existingProof]);

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingProof,
    ownerEmail,
    photoLoading,
    errors,
    handleInputChange,
    handleFileChange,
    removeProof,
    handleSubmit,
  };
};
