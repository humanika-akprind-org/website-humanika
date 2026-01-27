import { useState, useEffect, useCallback, useRef } from "react";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/domain/entities/document.entity";
import { Status } from "@/domain/enums";
import { useFile } from "@/presentation/hooks/useFile";
import {
  documentFolderId,
  accountabilityReportFolderId,
  proposalFolderId,
} from "@/presentation/lib/config/config";
import { getAccessTokenAction } from "@/presentation/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
} from "@/infrastructure/external-services/google-drive/file-utils";

const getFolderIdForDocumentType = (
  documentTypeName: string | undefined,
  documentTypes: { id: string; name: string }[] | undefined,
): string => {
  if (!documentTypeName || !documentTypes) return documentFolderId;

  const normalizedType = documentTypeName.toLowerCase().replace(/[\s\-]/g, "");
  if (normalizedType === "accountabilityreport") {
    return accountabilityReportFolderId;
  } else if (normalizedType === "proposal") {
    return proposalFolderId;
  }
  return documentFolderId;
};

interface UseDocumentFormProps {
  document?: Document;
  accessToken?: string;
  onSubmit: (data: CreateDocumentInput | UpdateDocumentInput) => Promise<void>;
  onSubmitForApproval?: (
    data: CreateDocumentInput | UpdateDocumentInput,
  ) => Promise<void>;
  fixedDocumentType?: string;
  documentTypes?: { id: string; name: string }[];
}

export function useDocumentForm({
  document,
  accessToken,
  onSubmit,
  onSubmitForApproval,
  fixedDocumentType,
  documentTypes,
}: UseDocumentFormProps) {
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

  // Compute initial documentTypeId
  const initialDocumentTypeId = (() => {
    if (document?.documentTypeId) return document.documentTypeId;
    if (fixedDocumentType && documentTypes) {
      return (
        documentTypes.find(
          (type) =>
            type.name.toLowerCase().replace(/[\s\-]/g, "") ===
            fixedDocumentType.toLowerCase().replace(/[\s\-]/g, ""),
        )?.id || ""
      );
    }
    return "";
  })();

  const [formData, setFormData] = useState({
    name: document?.name || "",
    documentTypeId: initialDocumentTypeId,
    status: document?.status || Status.DRAFT,
    letterId: document?.letterId || "",
    periodId: document?.periodId || "",
    documentFile: undefined as File | undefined,
  });

  const [isLoadingState, setIsLoadingState] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [existingDocument, setExistingDocument] = useState<
    string | null | undefined
  >(document?.document);
  const [removedDocument, setRemovedDocument] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  // Use ref to track if owner fetch is in progress to prevent race conditions
  const ownerFetchInProgress = useRef<boolean>(false);
  // Track if file was not found in Google Drive (separate from general errors)
  const [fileNotFound, setFileNotFound] = useState(false);

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
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
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
          document: "File size must be less than 10MB",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, documentFile: file }));
      setExistingDocument(null); // Hide existing file display when new file is selected
      setError(null);
      setErrors((prev) => ({ ...prev, document: "" }));
      setRemovedDocument(false); // Reset removed state when new file is selected
    }
  };

  const removeDocument = () => {
    if (isGoogleDriveFile(existingDocument)) {
      setRemovedDocument(true);
    }

    setFormData((prev) => ({ ...prev, documentFile: undefined }));
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
      newErrors.name = "Please enter document name";
    }
    // Only require a file if there is no existing document and fileNotFound is false
    if (!formData.documentFile && !existingDocument && !fileNotFound) {
      newErrors.document = "Please upload a document file";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setIsLoadingState(false);
      return;
    }

    // Check if access token is available
    if (!(accessToken || fetchedAccessToken)) {
      setError("Authentication required. Please log in to Google Drive.");
      setIsLoadingState(false);
      return;
    }

    try {
      // Handle document deletion if marked for removal
      let documentUrl: string | null | undefined = existingDocument;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedDocument &&
        document?.document &&
        isGoogleDriveFile(document.document)
          ? getFileIdFromFile(document.document)
          : null;

      // If user wants to remove the old document or replace it, check ownership first
      if ((removedDocument || formData.documentFile) && oldFileId) {
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
                ? `You don't have permission to modify this file. Use email ${extractedEmail} to edit or delete this document.`
                : errorMsg,
            );
          }
          // For 404 errors (file already deleted), log but continue
          const errWithStatus = err as Error & {
            status?: number;
            notFound?: boolean;
          };
          if (errWithStatus.status === 404 || errWithStatus.notFound) {
            console.warn("File already deleted from Google Drive:", oldFileId);
            // Continue - file is already gone
          } else {
            // For other errors, log but continue (non-critical)
            console.warn("Failed to delete old document:", err);
          }
        }
      }

      if (removedDocument) {
        documentUrl = null;
      }

      // If file was not found in Google Drive, we need to require a new file upload
      if (fileNotFound && !formData.documentFile) {
        throw new Error(
          "The original file is no longer available in Google Drive. Please upload a new file to replace it.",
        );
      }

      if (formData.documentFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const folderId = getFolderIdForDocumentType(
          fixedDocumentType,
          documentTypes,
        );
        const uploadedFileId = await uploadFile(
          formData.documentFile,
          tempFileName,
          folderId,
        );

        if (uploadedFileId) {
          const finalFileName = `document-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              documentUrl = uploadedFileId;
            } else {
              console.warn("Failed to set public access for document");
              documentUrl = uploadedFileId;
            }
          } else {
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded document:", err);
            });
            throw new Error("Failed to rename document");
          }
        } else {
          throw new Error("Failed to upload document");
        }
      }

      // Submit form data with document URL (exclude documentFile for server action)
      const { documentFile: _, ...dataToSend } = formData;

      // For onSubmitForApproval on proposal/accountability report pages, ensure documentTypeId is set
      let finalDocumentTypeId = dataToSend.documentTypeId;
      if (onSubmitForApproval && fixedDocumentType) {
        const normalizedFixed = fixedDocumentType
          .toLowerCase()
          .replace(/[\s\-]/g, "");
        if (
          normalizedFixed === "proposal" ||
          normalizedFixed === "accountabilityreport"
        ) {
          finalDocumentTypeId =
            documentTypes?.find(
              (type) =>
                type.name.toLowerCase().replace(/[\s\-]/g, "") ===
                normalizedFixed,
            )?.id || "";
        }
      }

      // Prepare data to send
      const submitData = {
        ...dataToSend,
        documentTypeId: finalDocumentTypeId,
        document: documentUrl,
        letterId: formData.letterId ? formData.letterId : undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Note: Redirect is already handled by onSubmit/onSubmitForApproval
      // setRemovedDocument(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document");
    } finally {
      setIsLoadingState(false);
    }
  };

  // Function to get file owner when there's an existing document
  const fetchFileOwner = useCallback(async () => {
    // Prevent concurrent fetches
    if (ownerFetchInProgress.current) {
      return;
    }

    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingDocument && isGoogleDriveFile(existingDocument)) {
      const fileId = getFileIdFromFile(existingDocument);
      if (fileId) {
        ownerFetchInProgress.current = true;
        try {
          const ownerInfo = await getFileDetails(fileId, token);
          if (ownerInfo?.emailAddress) {
            setOwnerEmail(ownerInfo.emailAddress);
          }
        } catch (err) {
          // Check if it's a 404 error - file not found in Google Drive
          const errWithStatus = err as Error & {
            status?: number;
            notFound?: boolean;
          };
          const errorMsg = err instanceof Error ? err.message : String(err);

          if (
            errWithStatus.status === 404 ||
            errWithStatus.notFound ||
            errorMsg.includes("not found")
          ) {
            // File doesn't exist in Google Drive anymore
            console.warn("File not found in Google Drive:", fileId);
            // Set a special state to indicate file is missing (separate from general error)
            setOwnerEmail(null);
            setFileNotFound(true);
            // Do NOT set main error here - we don't want to block form submission
          } else {
            console.warn("Failed to fetch file owner:", err);
          }
        } finally {
          ownerFetchInProgress.current = false;
        }
      }
    }
  }, [existingDocument, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing document
  useEffect(() => {
    // Only fetch if we haven't already fetched and have owner email
    if (existingDocument && !ownerEmail && !ownerFetchInProgress.current) {
      fetchFileOwner();
    }
  }, [existingDocument, ownerEmail, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (
      fetchedAccessToken &&
      existingDocument &&
      !ownerEmail &&
      !ownerFetchInProgress.current
    ) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, existingDocument, ownerEmail, fetchFileOwner]);

  return {
    formData,
    isLoadingState,
    error,
    existingDocument,
    ownerEmail,
    fileLoading,
    errors,
    fileNotFound,
    accessToken: accessToken || fetchedAccessToken,
    handleInputChange,
    handleFileChange,
    removeDocument,
    handleSubmit,
  };
}
