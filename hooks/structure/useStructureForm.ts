import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  OrganizationalStructure,
  CreateOrganizationalStructureInput,
  UpdateOrganizationalStructureInput,
} from "@/types/structure";
import { Status } from "@/types/enums";
import type { Period } from "@/types/period";
import { useFile } from "@/hooks/useFile";
import {
  structureFolderId,
  organizationalStructureFolderId,
} from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";

import { PeriodApi } from "@/use-cases/api/period";
import type { AlertType } from "@/components/admin/ui/alert/Alert";

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
    }
  }, [fileError]);

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

    // Delete old decree AFTER successful upload and rename
    if (oldFileId) {
      setTimeout(() => {
        deleteFile(oldFileId).catch((err) => {
          console.warn("Failed to delete old decree (non-critical):", err);
        });
      }, 2000); // Delay to ensure new file is fully processed
    }

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

    // Delete old structure image AFTER successful upload and rename
    if (oldFileId) {
      setTimeout(() => {
        deleteFile(oldFileId).catch((err) => {
          console.warn(
            "Failed to delete old structure image (non-critical):",
            err,
          );
        });
      }, 2000); // Delay to ensure new file is fully processed
    }

    return { structureImageUrl: uploadedFileId, error: null };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAlert(null);

    try {
      // Validate required fields
      if (!formData.name.trim()) {
        throw new Error("Please enter structure name");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
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
      setError("File size must be less than 10MB");
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
      setError("Please select a valid document file");
      return;
    }

    setFormData((prev) => ({ ...prev, decreeFile: file }));
    setError(null);
    setRemovedDecree(false);
  };

  const handleStructureImageChange = (file: File) => {
    // Validate file size
    if (file.size > 10 * 1024 * 1024) {
      setError("File size must be less than 10MB");
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
      setError("Please select a valid image file (JPG, PNG, GIF, WEBP)");
      return;
    }

    setFormData((prev) => ({ ...prev, structureImage: file }));
    setError(null);
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
    alert,
    previewUrl,
    existingDecree,
    existingStructureImage,
    removedDecree,
    removedStructureImage,
    fileLoading,
    removeDecree,
    removeStructureImage,
    handleSubmit,
    handleFileChange,
    handleStructureImageChange,
  };
};
