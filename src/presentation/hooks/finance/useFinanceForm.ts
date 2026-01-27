import { useState, useEffect, useCallback } from "react";
import type {
  Finance,
  CreateFinanceInput,
  UpdateFinanceInput,
} from "@/domain/entities/finance";
import { FinanceType, Status } from "@/domain/enums/enums";
import { useFile } from "@/presentation/hooks/useFile";
import { financeFolderId } from "@/presentation/lib/config/config";
import { getAccessTokenAction } from "@/presentation/lib/actions/accessToken";
import type { FinanceCategory } from "@/domain/value-objects/finance-category";
import { type WorkProgram } from "@/domain/entities/work";

// Helper function to get preview URL from file (file ID or URL)
const getPreviewUrl = (file: string | null | undefined): string | null => {
  if (!file) return null;

  if (file.includes("drive.google.com")) {
    // It's a full Google Drive URL, convert to direct image URL
    const fileIdMatch = file.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return file;
  } else if (file.match(/^[a-zA-Z0-9_-]+$/)) {
    // It's a Google Drive file ID, construct direct URL
    return `/api/drive-image?fileId=${file}`;
  } else {
    // It's a direct URL or other format
    return file;
  }
};

// Helper function to check if file is from Google Drive (either URL or file ID)
const isGoogleDriveFile = (file: string | null | undefined): boolean => {
  if (!file) return false;
  return (
    file.includes("drive.google.com") || file.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

// Helper function to get file ID from file (either URL or file ID)
const getFileIdFromFile = (file: string | null | undefined): string | null => {
  if (!file) return null;

  if (file.includes("drive.google.com")) {
    const fileIdMatch = file.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (file.match(/^[a-zA-Z0-9_-]+$/)) {
    return file;
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
    isLoading: fileLoading,
    error: fileError,
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
    file: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingDocument, setExistingDocument] = useState<
    string | null | undefined
  >(finance?.proof);
  const [removedDocument, setRemovedDocument] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Initialize preview URL when component mounts with existing data
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(finance?.proof));
  }, [finance?.proof]);

  // Update preview URL when existingDocument changes
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingDocument));
  }, [existingDocument]);

  useEffect(() => {
    if (fileError) {
      setError(fileError);
      // Check if it's a 403 error with owner email info
      if (fileError.includes("permission") || fileError.includes("Use email")) {
        // Extract email from error message if present
        const emailMatch = fileError.match(/Use email\s+(.+?)\s+to/);
        if (emailMatch && emailMatch[1]) {
          setOwnerEmail(emailMatch[1]);
        }
      }
    }
  }, [fileError]);

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
    handleFileSelect(file);
  };

  const handleFileSelect = (file: File | null | undefined) => {
    if (file) {
      // Validasi file
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          document: "File size must be less than 5MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, file: file }));
      setError(null);
      setErrors((prev) => ({ ...prev, document: "" }));

      // Create preview URL for images
      if (file.type.startsWith("image/")) {
        const url = URL.createObjectURL(file);
        setPreviewUrl(url);
      } else {
        setPreviewUrl(null);
      }
      setRemovedDocument(false); // Reset removed state when new file is selected
    }
  };

  const removeDocument = () => {
    if (isGoogleDriveFile(existingDocument)) {
      // Mark file as removed for deletion during form submission
      setRemovedDocument(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, file: undefined }));
    setPreviewUrl(null);
    setExistingDocument(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);
    setOwnerEmail(null);

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Please enter transaction name";
    }
    if (!formData.amount || formData.amount <= 0) {
      newErrors.amount = "Amount must be greater than 0";
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select a category";
    }
    if (!formData.date) {
      newErrors.date = "Please select date";
    }
    if (!formData.file && !existingDocument) {
      newErrors.document = "Please upload a file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoadingState(false);
      return;
    }

    try {
      // Handle file deletion if marked for removal
      let fileUrl: string | null | undefined = existingDocument;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedDocument && finance?.proof && isGoogleDriveFile(finance.proof)
          ? getFileIdFromFile(finance.proof)
          : null;

      // If user wants to remove the old file or replace it, check ownership first
      if ((removedDocument || formData.file) && oldFileId) {
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
                ? `You don't have permission to modify this file. Use email ${extractedEmail} to edit or delete this file.`
                : errorMsg,
            );
          }
          // For other errors, log but continue (non-critical)
          console.warn("Failed to delete old file:", err);
        }
      }

      if (removedDocument) {
        fileUrl = null;
      }

      if (formData.file) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.file,
          tempFileName,
          financeFolderId,
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `finance-file-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              fileUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for file");
            }
          } else {
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded file:", err);
            });
            throw new Error("Failed to rename file");
          }
        } else {
          throw new Error("Failed to upload file");
        }
      }

      // Submit form data with file URL (exclude file for server action)
      const { file: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        proof: fileUrl,
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
      setRemovedDocument(false);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to save transaction",
      );
    } finally {
      setIsLoadingState(false);
    }
  };

  // Function to get file owner when there's an existing file
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingDocument && isGoogleDriveFile(existingDocument)) {
      const fileId = getFileIdFromFile(existingDocument);
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
  }, [existingDocument, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing file
  useEffect(() => {
    if (existingDocument) {
      fetchFileOwner();
    }
  }, [existingDocument, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (fetchedAccessToken && existingDocument) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, fetchFileOwner, existingDocument]);

  return {
    formData,
    setFormData,
    isLoadingState,
    error,
    previewUrl,
    existingDocument,
    ownerEmail,
    fileLoading,
    errors,
    handleInputChange,
    handleFileChange,
    handleFileSelect,
    removeDocument,
    handleSubmit,
  };
};
