import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Letter,
  CreateLetterInput,
  UpdateLetterInput,
} from "@/types/letter";
import { LetterType, LetterPriority } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { letterFolderId } from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";

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
    data: CreateLetterInput | UpdateLetterInput
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
    date: letter?.date ? new Date(letter.date).toISOString().split("T")[0] : "",
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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fileError) {
      setError(fileError);
    }
  }, [fileError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
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
      if (file.size > 10 * 1024 * 1024) {
        setError("File size must be less than 10MB");
        return;
      }

      setFormData((prev) => ({ ...prev, letterFile: file }));
      setExistingLetter(null); // Hide existing file display when new file is selected
      setError(null);
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
          "Authentication required. Please log in to Google Drive."
        );
      }

      // Handle letter deletion if marked for removal
      let letterUrl: string | null | undefined = existingLetter;

      if (removedLetter) {
        if (letter?.letter && isGoogleDriveLetter(letter.letter)) {
          const fileId = getFileIdFromLetter(letter.letter);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete letter:", deleteError);
            }
          }
        }
        letterUrl = null;
      }

      if (formData.letterFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.letterFile,
          tempFileName,
          letterFolderId
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

          // Delete old letter after successful upload
          if (
            !removedLetter &&
            letter?.letter &&
            isGoogleDriveLetter(letter.letter)
          ) {
            const fileId = getFileIdFromLetter(letter.letter);
            if (fileId) {
              try {
                await deleteFile(fileId);
              } catch (deleteError) {
                console.warn("Failed to delete old letter:", deleteError);
              }
            }
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
        date: new Date(formData.date).toISOString(),
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

  // Helper function to get file ID from letter (either URL or file ID)
  const getFileIdFromLetter = (
    ltr: string | null | undefined
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
    fileLoading,
    errors,
    accessToken: accessToken || fetchedAccessToken,
    handleInputChange,
    handleFileChange,
    removeLetter,
    handleSubmit,
  };
}
