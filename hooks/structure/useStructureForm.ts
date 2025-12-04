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
      | UpdateOrganizationalStructureInput
  ) => Promise<void>
) => {
  const router = useRouter();
  const [periods, setPeriods] = useState<Period[]>([]);
  const [accessToken, setAccessToken] = useState<string>("");

  const {
    uploadFile,
    deleteFile,
    renameFile,
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

      let decreeUrl: string | null | undefined = existingDecree;
      let structureImageUrl: string | null | undefined = existingStructureImage;

      // Handle decree deletion
      if (removedDecree) {
        // Delete from Google Drive and set decreeUrl to null
        if (structure?.decree) {
          const fileId = getFileIdFromStructureImage(structure.decree);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete decree:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        decreeUrl = null;
      }

      // Handle structure image deletion
      if (removedStructureImage) {
        // Delete from Google Drive and set structureImageUrl to null
        if (structure?.structure) {
          const fileId = getFileIdFromStructureImage(structure.structure);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete structure image:", deleteError);
              // Continue with submission even if delete fails
            }
          }
        }
        structureImageUrl = null;
      }

      // Handle decree file upload
      if (formData.decreeFile) {
        // Delete old decree from Google Drive if it exists and wasn't already removed
        if (!removedDecree && structure?.decree) {
          const fileId = getFileIdFromStructureImage(structure.decree);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old decree:", deleteError);
              // Continue with upload even if delete fails
            }
          }
        }

        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.decreeFile,
          tempFileName,
          structureFolderId
        );

        if (uploadedFileId) {
          const finalFileName = `decree_${formData.name}_${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            decreeUrl = uploadedFileId;
          } else {
            throw new Error("Failed to rename decree");
          }
        } else {
          throw new Error("Failed to upload decree");
        }
      }

      // Handle structure image upload
      if (formData.structureImage) {
        // Delete old structure image from Google Drive if it exists and wasn't already removed
        if (!removedStructureImage && structure?.structure) {
          const fileId = getFileIdFromStructureImage(structure.structure);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn(
                "Failed to delete old structure image:",
                deleteError
              );
              // Continue with upload even if delete fails
            }
          }
        }

        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.structureImage,
          tempFileName,
          organizationalStructureFolderId
        );

        if (uploadedFileId) {
          const finalFileName = `structure_image_${
            formData.name
          }_${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            structureImageUrl = uploadedFileId;
          } else {
            throw new Error("Failed to rename structure image");
          }
        } else {
          throw new Error("Failed to upload structure image");
        }
      }

      // Prepare and submit data
      const { decreeFile: _, structureImage: __, ...dataToSend } = formData;
      const submitData = {
        ...dataToSend,
        decree: decreeUrl || "",
        structure: structureImageUrl,
      };

      await onSubmit(submitData);

      // If there was a file uploaded, run removePhoto logic to clean up form state
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
    structureImage: string | null | undefined
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
