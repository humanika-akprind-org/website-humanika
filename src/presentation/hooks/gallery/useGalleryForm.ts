// hooks/gallery/useGalleryForm.ts
import { useState, useEffect, useCallback } from "react";
import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/domain/entities/gallery.entity";
import type { Event } from "@/domain/entities/event.entity";
import { useEvents } from "@/presentation/hooks/event/useEvents";
import { useGalleryCategories } from "@/presentation/hooks/gallery-category/useGalleryCategories";
import { useFile } from "@/presentation/hooks/useFile";
import { galleryFolderId } from "@/presentation/lib/config/config";
import { getAccessTokenAction } from "@/presentation/lib/actions/accessToken";

// Helper functions
const getPreviewUrl = (image: string | null | undefined): string | null => {
  if (!image) return null;

  if (image.includes("drive.google.com")) {
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return image;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${image}`;
  } else {
    return image;
  }
};

const isGoogleDriveImage = (image: string | null | undefined): boolean => {
  if (!image) return false;
  return (
    image.includes("drive.google.com") ||
    image.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

const getFileIdFromImage = (
  image: string | null | undefined,
): string | null => {
  if (!image) return null;

  if (image.includes("drive.google.com")) {
    const fileIdMatch = image.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (image.match(/^[a-zA-Z0-9_-]+$/)) {
    return image;
  }
  return null;
};

export interface GalleryFormData {
  title: string;
  eventId: string;
  categoryId?: string;
  periodId?: string;
  imageFile?: File;
}

export const useGalleryForm = (
  gallery?: Gallery,
  onSubmit?: (data: CreateGalleryInput | UpdateGalleryInput) => Promise<void>,
  accessToken?: string,
  propEvents?: Event[],
) => {
  const [fetchedAccessToken, setFetchedAccessToken] = useState<string>("");

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    getFileDetails,
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

  const { events: eventsData, isLoading: eventsLoading } = useEvents();
  const { categories: galleryCategories, isLoading: categoriesLoading } =
    useGalleryCategories();

  const events = propEvents || eventsData || [];

  const [formData, setFormData] = useState<GalleryFormData>({
    title: gallery?.title || "",
    eventId: gallery?.eventId || "",
    categoryId: gallery?.categoryId || "",
    periodId: gallery?.periodId || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null | undefined>(
    gallery?.image,
  );
  const [removedImage, setRemovedImage] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  // Initialize preview URL
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(gallery?.image));
  }, [gallery?.image]);

  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingImage));
  }, [existingImage]);

  useEffect(() => {
    if (photoError) {
      setError(photoError);
      // Check if it's a 403 error with owner email info
      if (
        photoError.includes("permission") ||
        photoError.includes("Use email")
      ) {
        // Extract email from error message if present
        const emailMatch = photoError.match(/Use email\s+(.+?)\s+to/);
        if (emailMatch && emailMatch[1]) {
          setOwnerEmail(emailMatch[1]);
        }
      }
    }
  }, [photoError]);

  // Function to get file owner when there's an existing image
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingImage && isGoogleDriveImage(existingImage)) {
      const fileId = getFileIdFromImage(existingImage);
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
  }, [existingImage, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing image
  useEffect(() => {
    if (existingImage) {
      fetchFileOwner();
    }
  }, [existingImage, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (fetchedAccessToken && existingImage) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, fetchFileOwner, existingImage]);

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
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      setFormData((prev) => ({ ...prev, imageFile: file }));
      setError(null);
      setErrors((prev) => ({ ...prev, image: "" }));

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRemovedImage(false);
    }
  };

  const removeImage = () => {
    if (isGoogleDriveImage(existingImage)) {
      setRemovedImage(true);
    }

    setFormData((prev) => ({ ...prev, imageFile: undefined }));
    setPreviewUrl(null);
    setExistingImage(null);
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.title.trim()) {
      newErrors.title = "Please enter gallery title";
      isValid = false;
    }
    if (!formData.eventId) {
      newErrors.eventId = "Please select an event";
      isValid = false;
    }
    if (!formData.imageFile && !existingImage) {
      newErrors.image = "Please upload an image";
      isValid = false;
    }
    // categoryId and periodId are optional fields - no validation needed

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Form submit triggered");
    if (!validateForm() || !onSubmit) {
      console.log("Validation failed or no onSubmit");
      return;
    }

    setIsSubmitting(true);
    setError(null);
    console.log("Starting form submission");

    try {
      let imageUrl: string | null | undefined = existingImage;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedImage && gallery?.image && isGoogleDriveImage(gallery.image)
          ? getFileIdFromImage(gallery.image)
          : null;

      // If user wants to remove the old image or replace it, check ownership first
      if ((removedImage || formData.imageFile) && oldFileId) {
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
                ? `You don't have permission to modify this file. Use email ${extractedEmail} to edit or delete this thumbnail.`
                : errorMsg,
            );
          }
          // For other errors, log but continue (non-critical)
          console.warn("Failed to delete old image:", err);
        }
      }

      if (removedImage) {
        imageUrl = null;
      }

      if (formData.imageFile) {
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.imageFile,
          tempFileName,
          galleryFolderId,
        );

        if (uploadedFileId) {
          const finalFileName = `gallery-${formData.title
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              imageUrl = uploadedFileId;
            } else {
              console.warn("Failed to set public access for image");
              imageUrl = uploadedFileId;
            }
          } else {
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded image:", err);
            });
            throw new Error("Failed to rename image");
          }
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const { imageFile: _, ...dataToSend } = formData;
      const submitData = {
        ...dataToSend,
        image: imageUrl || undefined,
      };

      await onSubmit(submitData);

      setRemovedImage(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save gallery");
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
    existingImage,
    removedImage,
    events,
    eventsLoading,
    galleryCategories,
    categoriesLoading,
    photoLoading,
    accessToken: accessToken || fetchedAccessToken,
    errors,
    ownerEmail,
    handleInputChange,
    handleFileChange,
    removeImage,
    handleSubmit,
  };
};
