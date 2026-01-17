import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Document,
  CreateDocumentInput,
  UpdateDocumentInput,
} from "@/types/document";
import { Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import {
  documentFolderId,
  accountabilityReportFolderId,
  proposalFolderId,
} from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import {
  isGoogleDriveFile,
  getFileIdFromFile,
} from "@/lib/google-drive/file-utils";

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
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (fileError) {
      setError(fileError);
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

    // Validate required fields
    const newErrors: Record<string, string> = {};
    if (!formData.name.trim()) {
      newErrors.name = "Please enter document name";
    }
    if (!formData.documentFile && !existingDocument) {
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

      if (removedDocument) {
        documentUrl = null;
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

            // Delete old document AFTER successful upload
            if (oldFileId) {
              setTimeout(() => {
                deleteFile(oldFileId).catch((err) => {
                  console.warn(
                    "Failed to delete old document (non-critical):",
                    err,
                  );
                });
              }, 2000);
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
      } else if (removedDocument && oldFileId) {
        // Delete old document if no new file uploaded
        try {
          await deleteFile(oldFileId);
        } catch (deleteError) {
          console.warn("Failed to delete document:", deleteError);
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
        letterId: formData.letterId ? formData.letterId : null,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      // Reset form state after successful submission
      setRemovedDocument(false);

      let redirectPath = "/admin/administration/documents";
      if (fixedDocumentType) {
        const normalized = fixedDocumentType
          .toLowerCase()
          .replace(/[\s\-]/g, "");
        if (normalized === "proposal") {
          redirectPath = "/admin/administration/proposals";
        } else if (normalized === "accountabilityreport") {
          redirectPath = "/admin/administration/accountability-reports";
        }
      }
      router.push(redirectPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save document");
    } finally {
      setIsLoadingState(false);
    }
  };

  return {
    formData,
    isLoadingState,
    error,
    existingDocument,
    fileLoading,
    errors,
    accessToken: accessToken || fetchedAccessToken,
    handleInputChange,
    handleFileChange,
    removeDocument,
    handleSubmit,
  };
}
