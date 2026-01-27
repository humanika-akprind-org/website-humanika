import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/domain/entities/organizational-structure.entity";
import { Status } from "@/domain/enums/enums";
import type { Period } from "@/domain/entities/period.entity";
import { useFile } from "@/presentation/hooks/useFile";
import {
  structureFolderId,
  organizationalStructureFolderId,
} from "@/presentation/lib/config/config";
import { getAccessTokenAction } from "@/presentation/lib/actions/accessToken";

import { PeriodApi } from "@/presentation/services/period";
import type { AlertType } from "@/presentation/components/admin/ui/alert/Alert";

export const useStructureForm = (
  structure: OrganizationalStructure | undefined,
  onSubmit: (
    data:
      | CreateOrganizationalStructureInput
      | UpdateOrganizationalStructureInput,
  ) => Promise<void>,
) => {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    getFileDetails,
    isLoading: fileLoading,
    error: fileError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState<{
    name: string;
    periodId: string;
    decreeFile?: File;
    structureImage?: File;
    status: Status;
  }>({
    name: structure?.name || "",
    periodId: structure?.periodId || "",
    decreeFile: undefined,
    structureImage: undefined,
    status: structure?.status || Status.DRAFT,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<{
    name?: string;
    periodId?: string;
    decreeFile?: string;
    structureImage?: string;
  }>({});
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingDecree, setExistingDecree] = useState<
    string | null | undefined
  >(structure?.decree);
  const [existingStructureImage, setExistingStructureImage] = useState<
    string | null | undefined
  >(structure?.structure);
  const [removedDecree, setRemovedDecree] = useState(false);
  const [removedStructureImage, setRemovedStructureImage] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  // Fetch access token
  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessTokenAction();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  // Fetch periods
  useEffect(() => {
    const fetchPeriods = async () => {
      try {
        const periodsResponse = await PeriodApi.getPeriods();
        setPeriods(Array.isArray(periodsResponse) ? periodsResponse : []);
      } catch (err) {
        console.error("Error loading periods:", err);
      }
    };

    fetchPeriods();
  }, []);

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

  // Function to get file owner when there's an existing file
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    if (!accessToken) {
      return;
    }

    // Check decree file
    if (existingDecree && existingDecree.includes("drive.google.com")) {
      const fileId = getFileIdFromStructureImage(existingDecree);
      if (fileId) {
        try {
          const ownerInfo = await getFileDetails(fileId, accessToken);
          if (ownerInfo?.emailAddress) {
            setOwnerEmail(ownerInfo.emailAddress);
          }
        } catch (err) {
          console.warn("Failed to fetch decree file owner:", err);
        }
      }
    }

    // Check structure image file
    if (
      existingStructureImage &&
      existingStructureImage.includes("drive.google.com")
    ) {
      const fileId = getFileIdFromStructureImage(existingStructureImage);
      if (fileId) {
        try {
          const ownerInfo = await getFileDetails(fileId, accessToken);
          if (ownerInfo?.emailAddress) {
            setOwnerEmail(ownerInfo.emailAddress);
          }
        } catch (err) {
          console.warn("Failed to fetch structure image owner:", err);
        }
      }
    }
  }, [existingDecree, existingStructureImage, accessToken, getFileDetails]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (accessToken && (existingDecree || existingStructureImage)) {
      fetchFileOwner();
    }
  }, [accessToken, fetchFileOwner, existingDecree, existingStructureImage]);

  const removeDecree = () => {
    setFormData((prev) => ({ ...prev, decreeFile: undefined }));
    setExistingDecree(null);
    setRemovedDecree(true);
  };

  const removeStructureImage = () => {
    setFormData((prev) => ({ ...prev, structureImage: undefined }));
    setPreviewUrl(null);
    setExistingStructureImage(null);
    setRemovedStructureImage(true);
  };

  // Helper function to check file ownership and handle 403 errors
  const checkFileOwnership = async (fileId: string): Promise<boolean> => {
    try {
      await deleteFile(fileId);
      return true;
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : String(err);
      const isPermissionError =
        errorMsg.toLowerCase().includes("insufficient permissions") ||
        errorMsg.toLowerCase().includes("permission") ||
        errorMsg.includes("Use email");

      if (isPermissionError) {
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
      // For other errors, assume we can proceed (non-critical)
      console.warn("Failed to check file ownership:", err);
      return true;
    }
  };

  // Helper function to process decree file upload
  const processDecreeUpload = async (): Promise<{
    decreeUrl: string | null | undefined;
    error: Error | null;
  }> => {
    if (!formData.decreeFile) {
      return { decreeUrl: existingDecree, error: null };
    }

    // Store old file ID for potential cleanup
    const oldFileId =
      !removedDecree && structure?.decree
        ? getFileIdFromStructureImage(structure.decree)
        : null;

    // Check ownership if old file exists
    if (oldFileId) {
      try {
        await checkFileOwnership(oldFileId);
      } catch (err) {
        return { decreeUrl: null, error: err as Error };
      }
    }

    const tempFileName = `temp_decree_${Date.now()}`;
    const uploadedFileId = await uploadFile(
      formData.decreeFile,
      tempFileName,
      structureFolderId,
    );

    if (!uploadedFileId) {
      return { decreeUrl: null, error: new Error("Failed to upload decree") };
    }

    const finalFileName = `decree_${formData.name}_${Date.now()}`;
    const renameSuccess = await renameFile(uploadedFileId, finalFileName);

    if (!renameSuccess) {
      // Clean up uploaded file if rename fails
      await deleteFile(uploadedFileId).catch((err) => {
        console.warn("Failed to clean up uploaded decree file:", err);
      });
      return { decreeUrl: null, error: new Error("Failed to rename decree") };
    }

    // Set public access for the decree (non-blocking)
    setPublicAccess(uploadedFileId).catch((err) => {
      console.warn("Failed to set public access for decree:", err);
    });

    return { decreeUrl: uploadedFileId, error: null };
  };

  // Helper function to process structure image upload
  const processStructureImageUpload = async (): Promise<{
    structureImageUrl: string | null | undefined;
    error: Error | null;
  }> => {
    if (!formData.structureImage) {
      return { structureImageUrl: existingStructureImage, error: null };
    }

    // Store old file ID for potential cleanup
    const oldFileId =
      !removedStructureImage && structure?.structure
        ? getFileIdFromStructureImage(structure.structure)
        : null;

    // Check ownership if old file exists
    if (oldFileId) {
      try {
        await checkFileOwnership(oldFileId);
      } catch (err) {
        return { structureImageUrl: null, error: err as Error };
      }
    }

    const tempFileName = `temp_structure_${Date.now()}`;
    const uploadedFileId = await uploadFile(
      formData.structureImage,
      tempFileName,
      organizationalStructureFolderId,
    );

    if (!uploadedFileId) {
      return {
        structureImageUrl: null,
        error: new Error("Failed to upload structure image"),
      };
    }

    const finalFileName = `structure_image_${formData.name}_${Date.now()}`;
    const renameSuccess = await renameFile(uploadedFileId, finalFileName);

    if (!renameSuccess) {
      // Clean up uploaded file if rename fails
      await deleteFile(uploadedFileId).catch((err) => {
        console.warn("Failed to clean up uploaded structure image file:", err);
      });
      return {
        structureImageUrl: null,
        error: new Error("Failed to rename structure image"),
      };
    }

    // Set public access for the structure image (non-blocking)
    setPublicAccess(uploadedFileId).catch((err) => {
      console.warn("Failed to set public access for structure image:", err);
    });

    return { structureImageUrl: uploadedFileId, error: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);
    setErrors({});
    setOwnerEmail(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        const fieldError = "Please enter structure name";
        setErrors((prev) => ({ ...prev, name: fieldError }));
        throw new Error(fieldError);
      }
      if (!formData.periodId) {
        const fieldError = "Please select a period";
        setErrors((prev) => ({ ...prev, periodId: fieldError }));
        throw new Error(fieldError);
      }

      // Wait for access token if not ready
      if (!accessToken) {
        // Fetch token if not available
        const token = await getAccessTokenAction();
        if (!token) {
          throw new Error("Authentication required. Please re-authenticate.");
        }
        setAccessToken(token);
      }

      let decreeUrl: string | null | undefined = existingDecree;
      let structureImageUrl: string | null | undefined = existingStructureImage;

      // Handle decree deletion if no new file uploaded
      if (removedDecree && !formData.decreeFile) {
        if (structure?.decree) {
          const fileId = getFileIdFromStructureImage(structure.decree);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete decree:", deleteError);
            }
          }
        }
        decreeUrl = null;
      }

      // Handle structure image deletion if no new file uploaded
      if (removedStructureImage && !formData.structureImage) {
        if (structure?.structure) {
          const fileId = getFileIdFromStructureImage(structure.structure);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete structure image:", deleteError);
            }
          }
        }
        structureImageUrl = null;
      }

      // Process uploads SEQUENTIALLY to avoid race conditions and ensure proper error handling
      // First: Process decree upload
      if (formData.decreeFile) {
        const decreeResult = await processDecreeUpload();
        if (decreeResult.error) {
          throw decreeResult.error;
        }
        decreeUrl = decreeResult.decreeUrl;
      }

      // Second: Process structure image upload (only after decree succeeds)
      if (formData.structureImage) {
        const structureImageResult = await processStructureImageUpload();
        if (structureImageResult.error) {
          throw structureImageResult.error;
        }
        structureImageUrl = structureImageResult.structureImageUrl;
      }

      // Prepare and submit data
      const { decreeFile: _, structureImage: __, ...dataToSend } = formData;
      const submitData = {
        ...dataToSend,
        decree: decreeUrl || "",
        structure: structureImageUrl,
      };

      await onSubmit(submitData);

      // Clean up form state
      if (formData.decreeFile) {
        removeDecree();
      }
      if (formData.structureImage) {
        removeStructureImage();
      }

      setRemovedDecree(false);
      setRemovedStructureImage(false);
      setAlert({
        type: "success",
        message: "Organizational structure saved successfully!",
      });
      router.push("/admin/governance/structure");
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err instanceof Error
            ? err.message
            : "Failed to save organizational structure",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (file: File) => {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        decreeFile: "File size must be less than 10MB",
      }));
      return;
    }

    // Validate file type
    const allowedTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-powerpoint",
      "application/vnd.openxmlformats-officedocument.presentationml.presentation",
      "text/plain",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];

    if (!allowedTypes.some((type) => file.type.includes(type.split("/")[1]))) {
      setErrors((prev) => ({
        ...prev,
        decreeFile: "Please select a valid document file",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, decreeFile: file }));
    setErrors((prev) => ({ ...prev, decreeFile: undefined }));
    setRemovedDecree(false);
  };

  const handleStructureImageChange = (file: File) => {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        structureImage: "File size must be less than 10MB",
      }));
      return;
    }

    // Validate file type (images only)
    const allowedImageTypes = [
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
    ];

    if (!allowedImageTypes.includes(file.type)) {
      setErrors((prev) => ({
        ...prev,
        structureImage:
          "Please select a valid image file (JPG, PNG, GIF, WEBP)",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, structureImage: file }));
    setErrors((prev) => ({ ...prev, structureImage: undefined }));
    setRemovedStructureImage(false);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Helper function to get file ID from structure image (either URL or file ID)
  const getFileIdFromStructureImage = (
    structureImage: string | null | undefined,
  ): string | null => {
    if (!structureImage) return null;

    if (structureImage.includes("drive.google.com")) {
      const fileIdMatch = structureImage.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (structureImage.match(/^[a-zA-Z0-9_-]+$/)) {
      return structureImage;
    }
    return null;
  };

  return {
    formData,
    setFormData,
    periods,
    accessToken,
    isLoading,
    error,
    errors,
    alert,
    previewUrl,
    existingDecree,
    existingStructureImage,
    removedDecree,
    removedStructureImage,
    ownerEmail,
    fileLoading,
    removeDecree,
    removeStructureImage,
    handleSubmit,
    handleFileChange,
    handleStructureImageChange,
  };
};
