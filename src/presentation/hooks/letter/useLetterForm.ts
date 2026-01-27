import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
} from "@/src/domain/entities/letter";
import { LetterType, LetterPriority } from "@/src/domain/enums/enums";
import { useFile } from "@/src/presentation/hooks/useFile";
import { letterFolderId } from "@/src/presentation/lib/config/config";
import { getAccessTokenAction } from "@/src/presentation/lib/actions/accessToken";

// Helper functions
const isGoogleDriveLetter = (ltr: string | null | undefined): boolean => {
  if (!ltr) return false;
  return (
    ltr.includes("drive.google.com") || ltr.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

interface UseLetterFormProps {
  letter?: Letter;
  accessToken?: string;
  onSubmit: (data: CreateLetterInput | UpdateLetterInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateLetterInput | UpdateLetterInput,
  ) => Promise<void>;
}

export function useLetterForm({
  letter,
  accessToken,
  onSubmit,
  onSubmitForApproval,
}: UseLetterFormProps) {
  const router = useRouter();
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
    regarding: letter?.regarding || "",
    number: letter?.number || "",
    date: letter?.date
      ? (() => {
          const date = new Date(letter.date);
          const year = date.getFullYear();
          const month = String(date.getMonth() + 1).padStart(2, "0");
          const day = String(date.getDate()).padStart(2, "0");
          return `${year}-${month}-${day}`;
        })()
      : "",
    type: letter?.type || LetterType.INCOMING,
    priority: letter?.priority || LetterPriority.NORMAL,
    classification: letter?.classification || undefined,
    origin: letter?.origin || "",
    destination: letter?.destination || "",
    body: letter?.body || "",
    notes: letter?.notes || "",
    periodId: letter?.periodId || "",
    eventId: letter?.eventId || "",
    letterFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingLetter, setExistingLetter] = useState<
    string | null | undefined
  >(letter?.letter);
  const [removedLetter, setRemovedLetter] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});

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
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
      if (file.size > 10 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          letter: "File size must be less than 10MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, letterFile: file }));
      setExistingLetter(null); // Hide existing file display when new file is selected
      setError(null);
      setErrors((prev) => ({ ...prev, letter: "" }));
      setRemovedLetter(false); // Reset removed state when new file is selected
    }
  };

  const removeLetter = () => {
    if (isGoogleDriveLetter(existingLetter)) {
      setRemovedLetter(true);
    }

    setFormData((prev) => ({ ...prev, letterFile: undefined }));
    setExistingLetter(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);
    setOwnerEmail(null);

    try {
      // Validate required fields
      if (!formData.regarding.trim()) {
        throw new Error("Please enter letter regarding");
      }
      if (!formData.number.trim()) {
        throw new Error("Please enter letter number");
      }
      if (!formData.date) {
        throw new Error("Please enter letter date");
      }
      if (!formData.origin.trim()) {
        throw new Error("Please enter letter origin");
      }
      if (!formData.destination.trim()) {
        throw new Error("Please enter letter destination");
      }

      // Check if access token is available
      if (!(accessToken || fetchedAccessToken)) {
        throw new Error(
          "Authentication required. Please log in to Google Drive.",
        );
      }

      // Handle letter deletion if marked for removal
      let letterUrl: string | null | undefined = existingLetter;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedLetter && letter?.letter && isGoogleDriveLetter(letter.letter)
          ? getFileIdFromLetter(letter.letter)
          : null;

      // If user wants to remove the old letter or replace it, check ownership first
      if ((removedLetter || formData.letterFile) && oldFileId) {
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
                ? `You don't have permission to modify this file. Use email ${extractedEmail} to edit or delete this letter.`
                : errorMsg,
            );
          }
          // For other errors, log but continue (non-critical)
          console.warn("Failed to delete old letter:", err);
        }
      }

      if (removedLetter) {
        letterUrl = null;
      }

      if (formData.letterFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.letterFile,
          tempFileName,
          letterFolderId,
        );

        if (uploadedFileId) {
          const finalFileName = `letter-${formData.regarding
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              letterUrl = uploadedFileId;
            } else {
              console.warn("Failed to set public access for letter");
              // Continue with submission even if setting public access fails
              letterUrl = uploadedFileId;
            }
          } else {
            console.warn("Failed to rename letter");
            // Continue with submission even if rename fails
            letterUrl = uploadedFileId;
          }
        } else {
          throw new Error("Failed to upload letter");
        }
      }

      // Submit form data with letter URL (exclude letterFile for server action)
      const { letterFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        letter: letterUrl || undefined,
        date: (() => {
          // Parse YYYY-MM-DD format and create Date object without timezone issues
          const parts = formData.date.split("-");
          const year = parseInt(parts[0], 10);
          const month = parseInt(parts[1], 10) - 1;
          const day = parseInt(parts[2], 10);
          // Create date at UTC midnight to avoid timezone shifts
          return new Date(Date.UTC(year, month, day));
        })(),
        periodId: formData.periodId || undefined,
        eventId: formData.eventId || undefined,
      };

      // Convert empty strings to undefined for optional fields
      if (submitData.periodId === "") submitData.periodId = undefined;
      if (submitData.eventId === "") submitData.eventId = undefined;

      if (onSubmitForApproval) {
        await onSubmitForApproval(submitData);
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedLetter(false);

      router.push("/admin/administration/letters");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save letter");
    } finally {
      setIsLoadingState(false);
    }
  };

  // Function to get file owner when there's an existing letter
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingLetter && isGoogleDriveLetter(existingLetter)) {
      const fileId = getFileIdFromLetter(existingLetter);
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
  }, [existingLetter, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing letter
  useEffect(() => {
    if (existingLetter) {
      fetchFileOwner();
    }
  }, [existingLetter, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (fetchedAccessToken && existingLetter) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, fetchFileOwner, existingLetter]);

  // Helper function to get file ID from letter (either URL or file ID)
  const getFileIdFromLetter = (
    ltr: string | null | undefined,
  ): string | null => {
    if (!ltr) return null;

    if (ltr.includes("drive.google.com")) {
      const fileIdMatch = ltr.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (ltr.match(/^[a-zA-Z0-9_-]+$/)) {
      return ltr;
    }
    return null;
  };

  return {
    formData,
    isLoadingState,
    error,
    existingLetter,
    ownerEmail,
    fileLoading,
    errors,
    accessToken: accessToken || fetchedAccessToken,
    handleInputChange,
    handleFileChange,
    removeLetter,
    handleSubmit,
  };
}
