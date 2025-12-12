// hooks/gallery/useGalleryForm.ts
import { useState, useEffect } from "react";
import type {
  Gallery,
  CreateGalleryInput,
  UpdateGalleryInput,
} from "@/types/gallery";
import type { Event } from "@/types/event";
import { useEvents } from "@/hooks/event/useEvents";
import { useGalleryCategories } from "@/hooks/gallery-category/useGalleryCategories";
import { useFile } from "@/hooks/useFile";
import { galleryFolderId } from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";

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
  image: string | null | undefined
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
  imageFile?: File;
}

export const useGalleryForm = (
  gallery?: Gallery,
  onSubmit?: (data: CreateGalleryInput | UpdateGalleryInput) => Promise<void>,
  accessToken?: string,
  propEvents?: Event[]
) => {
  const [fetchedAccessToken, setFetchedAccessToken] = useState<string>("");

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
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
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingImage, setExistingImage] = useState<string | null | undefined>(
    gallery?.image
  );
  const [removedImage, setRemovedImage] = useState(false);

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
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
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
    if (!formData.title.trim()) {
      setError("Please enter gallery title");
      return false;
    }
    if (!formData.eventId) {
      setError("Please select an event");
      return false;
    }

    return true;
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

      if (removedImage) {
        if (gallery?.image && isGoogleDriveImage(gallery.image)) {
          const fileId = getFileIdFromImage(gallery.image);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete image:", deleteError);
            }
          }
        }
        imageUrl = null;
      }

      if (formData.imageFile) {
        if (
          !removedImage &&
          gallery?.image &&
          isGoogleDriveImage(gallery.image)
        ) {
          const fileId = getFileIdFromImage(gallery.image);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old image:", deleteError);
            }
          }
        }

        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.imageFile,
          tempFileName,
          galleryFolderId
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
              // Continue with submission even if setting public access fails
              imageUrl = uploadedFileId;
            }
          } else {
            console.warn("Failed to rename image");
            // Continue with submission even if rename fails
            imageUrl = uploadedFileId;
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
    handleInputChange,
    handleFileChange,
    removeImage,
    handleSubmit,
  };
};
