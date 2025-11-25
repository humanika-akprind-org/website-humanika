import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { documentFolderId } from "@/lib/config/config";

interface UseDocumentFormProps {
  document?: Document;
  accessToken: string;
  onSubmit: (data: CreateDocumentInput | UpdateDocumentInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateDocumentInput | UpdateDocumentInput
  ) => Promise<void>;
}

export function useDocumentForm({
  document,
  accessToken,
  onSubmit,
  onSubmitForApproval,
}: UseDocumentFormProps) {
  const router = useRouter();
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: fileLoading,
    error: fileError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState({
    name: document?.name || "",
    documentTypeId: document?.documentTypeId || "",
    status: document?.status || Status.DRAFT,
    eventId: document?.eventId || "",
    letterId: document?.letterId || "",
    documentFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDocument, setExistingDocument] = useState<
    string | null | undefined
  >(document?.document);
  const [removedDocument, setRemovedDocument] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fileError) {
      setError(fileError);
    }
  }, [fileError]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
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

      setFormData((prev) => ({ ...prev, documentFile: file }));
      setError(null);
      setRemovedDocument(false); // Reset removed state when new file is selected
    }
  };

  const removeDocument = () => {
    if (existingDocument) {
      // Mark document as removed for deletion during form submission
      setRemovedDocument(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, documentFile: undefined }));
    setExistingDocument(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoadingState(true);
    setError(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter document name");
      }

      // Check if access token is available
      if (!accessToken) {
        throw new Error(
          "Authentication required. Please log in to Google Drive."
        );
      }

      // Handle document deletion if marked for removal
      let documentUrl: string | null | undefined = existingDocument;

      if (removedDocument) {
        // Delete from Google Drive and set documentUrl to null
        if (document?.document) {
          const fileId = getFileIdFromDocument(document.document);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete document:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        documentUrl = null;
      }

      if (formData.documentFile) {
        // Delete old document from Google Drive if it exists and wasn't already removed
        if (!removedDocument && document?.document) {
          const fileId = getFileIdFromDocument(document.document);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old document:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.documentFile,
          tempFileName,
          documentFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `document-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set the file to public access
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              documentUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for document");
            }
          } else {
            throw new Error("Failed to rename document");
          }
        } else {
          throw new Error("Failed to upload document");
        }
      }

      // Submit form data with document URL (exclude documentFile for server action)
      const { documentFile: _, ...dataToSend } = formData;

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        document: documentUrl,
        eventId: formData.eventId || undefined,
        letterId: formData.letterId || undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedDocument(false);

      router.push("/admin/administration/documents");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document");
    } finally {
      setIsLoadingState(false);
    }
  };

  // Helper function to get file ID from document (either URL or file ID)
  const getFileIdFromDocument = (
    doc: string | null | undefined
  ): string | null => {
    if (!doc) return null;

    if (doc.includes("drive.google.com")) {
      const fileIdMatch = doc.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (doc.match(/^[a-zA-Z0-9_-]+$/)) {
      return doc;
    }
    return null;
  };

  return {
    formData,
    isLoadingState,
    error,
    existingDocument,
    fileLoading,
    errors,
    handleInputChange,
    handleFileChange,
    removeDocument,
    handleSubmit,
  };
}
