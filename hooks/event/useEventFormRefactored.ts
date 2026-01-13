import { useState, useEffect } from "react";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  ScheduleItem,
} from "@/types/event";
import { Department as DepartmentEnum, Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { useWorkPrograms } from "@/hooks/work-program/useWorkPrograms";
import { useEventCategories } from "@/hooks/event-category/useEventCategories";
import { eventThumbnailFolderId } from "@/lib/config/config";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { useUserManagement } from "@/hooks/user/useUserManagement";
import { usePeriodManagement } from "@/hooks/period/usePeriodManagement";

// Helper function to check if HTML content is empty
const isHtmlEmpty = (html: string): boolean => {
  const text = html.replace(/<[^>]*>/g, "").trim();
  return text.length === 0;
};

const getPreviewUrl = (thumbnail: string | null | undefined): string | null => {
  if (!thumbnail) return null;

  if (thumbnail.includes("drive.google.com")) {
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    if (fileIdMatch) {
      return `/api/drive-image?fileId=${fileIdMatch[1]}`;
    }
    return thumbnail;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    return `/api/drive-image?fileId=${thumbnail}`;
  } else {
    return thumbnail;
  }
};

const isGoogleDriveThumbnail = (
  thumbnail: string | null | undefined
): boolean => {
  if (!thumbnail) return false;
  return (
    thumbnail.includes("drive.google.com") ||
    thumbnail.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

const getFileIdFromThumbnail = (
  thumbnail: string | null | undefined
): string | null => {
  if (!thumbnail) return null;

  if (thumbnail.includes("drive.google.com")) {
    const fileIdMatch = thumbnail.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
    return fileIdMatch ? fileIdMatch[1] : null;
  } else if (thumbnail.match(/^[a-zA-Z0-9_-]+$/)) {
    return thumbnail;
  }
  return null;
};

export interface EventFormData {
  name: string;
  description: string;
  goal: string;
  department: DepartmentEnum;
  periodId: string;
  responsibleId: string;
  schedules: ScheduleItem[];
  workProgramId: string;
  categoryId: string;
  thumbnailFile?: File;
}

export const useEventForm = (
  event?: Event,
  onSubmit?: (data: CreateEventInput | UpdateEventInput) => Promise<void>,
  onSubmitForApproval?: (
    data: CreateEventInput | UpdateEventInput
  ) => Promise<void>,
  accessToken?: string,
  users?: User[],
  periods?: Period[]
) => {
  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  const { workPrograms, isLoading: workProgramsLoading } = useWorkPrograms();
  const { categories: eventCategories, isLoading: categoriesLoading } =
    useEventCategories();

  const { users: fetchedUsers, loading: usersLoading } = useUserManagement();
  const { periods: fetchedPeriods, loading: periodsLoading } =
    usePeriodManagement();

  const [formData, setFormData] = useState<EventFormData>({
    name: event?.name || "",
    description: event?.description || "",
    goal: event?.goal || "",
    department: event?.department || DepartmentEnum.BPH,
    periodId: event?.period?.id || "",
    responsibleId: event?.responsible?.id || "",
    schedules: event?.schedules || [],
    workProgramId: event?.workProgram?.id || "",
    categoryId: event?.category?.id || "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<
    string | null | undefined
  >(event?.thumbnail);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);

  // Initialize preview URL
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(event?.thumbnail));
  }, [event?.thumbnail]);

  useEffect(() => {
    setPreviewUrl(getPreviewUrl(existingThumbnail));
  }, [existingThumbnail]);

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

  const handleDescriptionChange = (value: string) => {
    setFormData((prev) => ({ ...prev, description: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError("File size must be less than 5MB");
        return;
      }

      if (!file.type.startsWith("image/")) {
        setError("Please select an image file");
        return;
      }

      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      setError(null);

      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setRemovedThumbnail(false);
    }
  };

  const removeThumbnail = () => {
    if (isGoogleDriveThumbnail(existingThumbnail)) {
      setRemovedThumbnail(true);
    }

    setFormData((prev) => ({ ...prev, thumbnailFile: undefined }));
    setPreviewUrl(null);
    setExistingThumbnail(null);
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Please enter event name");
      return false;
    }
    if (isHtmlEmpty(formData.description)) {
      setError("Please enter description");
      return false;
    }
    if (!formData.goal.trim()) {
      setError("Please enter goal");
      return false;
    }
    if (!formData.periodId) {
      setError("Please select a period");
      return false;
    }
    if (!formData.responsibleId) {
      setError("Please select responsible person");
      return false;
    }
    if (!formData.schedules || formData.schedules.length === 0) {
      setError("Please add at least one schedule");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !onSubmit) return;

    setIsSubmitting(true);
    setError(null);

    try {
      let thumbnailUrl: string | null | undefined = existingThumbnail;

      if (removedThumbnail) {
        if (event?.thumbnail && isGoogleDriveThumbnail(event.thumbnail)) {
          const fileId = getFileIdFromThumbnail(event.thumbnail);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete thumbnail:", deleteError);
            }
          }
        }
        thumbnailUrl = null;
      }

      if (formData.thumbnailFile) {
        if (
          !removedThumbnail &&
          event?.thumbnail &&
          isGoogleDriveThumbnail(event.thumbnail)
        ) {
          const fileId = getFileIdFromThumbnail(event.thumbnail);
          if (fileId) {
            try {
              await deleteFile(fileId);
            } catch (deleteError) {
              console.warn("Failed to delete old thumbnail:", deleteError);
            }
          }
        }

        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.thumbnailFile,
          tempFileName,
          eventThumbnailFolderId
        );

        if (uploadedFileId) {
          const finalFileName = `event-thumbnail-${formData.name
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              thumbnailUrl = uploadedFileId;
            } else {
              throw new Error("Failed to set public access for thumbnail");
            }
          } else {
            throw new Error("Failed to rename thumbnail");
          }
        } else {
          throw new Error("Failed to upload thumbnail");
        }
      }

      const { thumbnailFile: _, ...dataToSend } = formData;
      const submitData = {
        ...dataToSend,
        thumbnail: thumbnailUrl,
        workProgramId:
          formData.workProgramId && formData.workProgramId.trim() !== ""
            ? formData.workProgramId
            : undefined,
      };

      if (onSubmitForApproval) {
        await onSubmitForApproval({ ...submitData, status: Status.PENDING });
      } else {
        await onSubmit(submitData);
      }

      setRemovedThumbnail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save event");
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
    existingThumbnail,
    removedThumbnail,
    workPrograms,
    workProgramsLoading,
    eventCategories,
    categoriesLoading,
    photoLoading,
    users: users || fetchedUsers,
    periods: periods || fetchedPeriods,
    usersLoading,
    periodsLoading,
    handleInputChange,
    handleDescriptionChange,
    handleFileChange,
    removeThumbnail,
    handleSubmit,
  };
};
