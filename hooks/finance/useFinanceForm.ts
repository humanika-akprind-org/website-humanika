import { useState, useEffect } from "react";
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
      ? new Date(finance.date).toISOString().split("T")[0]
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

            // Delete old proof AFTER successful upload
            if (oldFileId) {
              setTimeout(() => {
                deleteFile(oldFileId).catch((err) => {
                  console.warn(
                    "Failed to delete old proof (non-critical):",
                    err,
                  );
                });
              }, 2000);
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
      } else if (removedProof && oldFileId) {
        // Delete old proof if no new file uploaded
        try {
          await deleteFile(oldFileId);
        } catch (deleteError) {
          console.warn("Failed to delete proof:", deleteError);
        }
      }

      // Submit form data with proof URL (exclude proofFile for server action)
      const { proofFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        proof: proofUrl,
        date: new Date(formData.date),
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

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingProof,
    photoLoading,
    errors,
    handleInputChange,
    handleFileChange,
    removeProof,
    handleSubmit,
  };
};
