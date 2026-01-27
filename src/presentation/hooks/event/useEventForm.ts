import { useState, useEffect, useCallback } from "react";
import type {
  Event,
  CreateEventInput,
  UpdateEventInput,
  ScheduleItem,
} from "@/domain/entities/event";
import { Department as DepartmentEnum, Status } from "@/domain/enums/enums";
import { useFile } from "@/presentation/hooks/useFile";
import { useWorkPrograms } from "@/presentation/hooks/work-program/useWorkPrograms";
import { useEventCategories } from "@/presentation/hooks/event-category/useEventCategories";
import { eventThumbnailFolderId } from "@/presentation/lib/config/config";
import type { User } from "@/domain/entities/user";
import type { Period } from "@/domain/entities/period";
import { useUserManagement } from "@/presentation/hooks/user/useUserManagement";
import { usePeriodManagement } from "@/presentation/hooks/period/usePeriodManagement";
import { getAccessTokenAction } from "@/presentation/lib/actions/accessToken";
import { UserApi } from "@/presentation/services/user";

// Helper functions
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
  thumbnail: string | null | undefined,
): boolean => {
  if (!thumbnail) return false;
  return (
    thumbnail.includes("drive.google.com") ||
    thumbnail.match(/^[a-zA-Z0-9_-]+$/) !== null
  );
};

const getFileIdFromThumbnail = (
  thumbnail: string | null | undefined,
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
    data: CreateEventInput | UpdateEventInput,
  ) => Promise<void>,
  accessToken?: string,
  users?: User[],
  periods?: Period[],
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

  const { workPrograms, isLoading: workProgramsLoading } = useWorkPrograms();
  const { categories: eventCategories, isLoading: categoriesLoading } =
    useEventCategories();

  const { users: fetchedUsers, loading: usersLoading } = useUserManagement({
    allData: true,
  });
  const { periods: fetchedPeriods, loading: periodsLoading } =
    usePeriodManagement();

  // User pagination state
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);
  const [searchedUsers, setSearchedUsers] = useState<User[]>([]);

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
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<
    string | null | undefined
  >(event?.thumbnail);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

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

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "File size must be less than 5MB",
        }));
        return;
      }

      if (!file.type.startsWith("image/")) {
        setErrors((prev) => ({
          ...prev,
          thumbnail: "Please select an image file",
        }));
        return;
      }

      setFormData((prev) => ({ ...prev, thumbnailFile: file }));
      setError(null);
      setErrors((prev) => ({ ...prev, thumbnail: "" }));

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
    const newErrors: Record<string, string> = {};
    let isValid = true;

    if (!formData.name.trim()) {
      newErrors.name = "Please enter event name";
      isValid = false;
    }
    if (isHtmlEmpty(formData.description)) {
      newErrors.description = "Please enter description";
      isValid = false;
    }
    if (!formData.goal.trim()) {
      newErrors.goal = "Please enter goal";
      isValid = false;
    }
    if (!formData.periodId) {
      newErrors.periodId = "Please select a period";
      isValid = false;
    }
    if (!formData.responsibleId) {
      newErrors.responsibleId = "Please select responsible person";
      isValid = false;
    }
    if (!formData.schedules || formData.schedules.length === 0) {
      newErrors.schedules = "Please add at least one schedule";
      isValid = false;
    }

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
    setOwnerEmail(null);
    console.log("Starting form submission");

    try {
      let thumbnailUrl: string | null | undefined = existingThumbnail;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedThumbnail &&
        event?.thumbnail &&
        isGoogleDriveThumbnail(event.thumbnail)
          ? getFileIdFromThumbnail(event.thumbnail)
          : null;

      // If user wants to remove the old thumbnail or replace it, check ownership first
      if ((removedThumbnail || formData.thumbnailFile) && oldFileId) {
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
          console.warn("Failed to delete old thumbnail:", err);
        }
      }

      if (removedThumbnail) {
        thumbnailUrl = null;
      }

      if (formData.thumbnailFile) {
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.thumbnailFile,
          tempFileName,
          eventThumbnailFolderId,
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
              console.warn("Failed to set public access for thumbnail");
              thumbnailUrl = uploadedFileId;
            }
          } else {
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded thumbnail:", err);
            });
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

  // Function to get file owner when there's an existing thumbnail
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    const token = accessToken || fetchedAccessToken;
    if (!token) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingThumbnail && isGoogleDriveThumbnail(existingThumbnail)) {
      const fileId = getFileIdFromThumbnail(existingThumbnail);
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
  }, [existingThumbnail, accessToken, fetchedAccessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing thumbnail
  useEffect(() => {
    if (existingThumbnail) {
      fetchFileOwner();
    }
  }, [existingThumbnail, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (fetchedAccessToken && existingThumbnail) {
      fetchFileOwner();
    }
  }, [fetchedAccessToken, fetchFileOwner, existingThumbnail]);

  // Search users function - fetches all matching users without pagination
  const searchUsers = async (query: string) => {
    setUserSearchQuery(query);
    setUserPage(1);
    setIsLoadingUsers(true);

    try {
      const response = await UserApi.getUsers({
        search: query,
        page: 1,
        allUsers: true, // Fetch all users without pagination for proper search
      });
      setSearchedUsers(response.data?.users || []);
      setHasMoreUsers(false); // All users are loaded, no need for load more
    } catch (err) {
      console.error("Error searching users:", err);
      setSearchedUsers([]);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  // Load more users function - for initial load without search
  const loadMoreUsers = async () => {
    if (isLoadingUsers || !hasMoreUsers) return;

    const nextPage = userPage + 1;
    setIsLoadingUsers(true);

    try {
      const response = await UserApi.getUsers({
        search: userSearchQuery,
        page: nextPage,
        allUsers: true, // Load all users when searching
      });
      const newUsers = response.data?.users || [];
      setSearchedUsers((prev) => {
        // Prevent duplicates
        const existingIds = new Set(prev.map((u) => u.id));
        const uniqueNewUsers = newUsers.filter((u) => !existingIds.has(u.id));
        return [...prev, ...uniqueNewUsers];
      });
      setUserPage(nextPage);
      setHasMoreUsers(false); // All users are loaded
    } catch (err) {
      console.error("Error loading more users:", err);
    } finally {
      setIsLoadingUsers(false);
    }
  };

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    errors,
    previewUrl,
    existingThumbnail,
    removedThumbnail,
    ownerEmail,
    workPrograms,
    workProgramsLoading,
    eventCategories,
    categoriesLoading,
    photoLoading,
    accessToken: accessToken || fetchedAccessToken,
    users: users || fetchedUsers,
    periods: periods || fetchedPeriods,
    usersLoading,
    periodsLoading,
    handleInputChange,
    handleFileChange,
    removeThumbnail,
    handleSubmit,
    loadMoreUsers,
    searchUsers,
    isLoadingUsers,
    hasMoreUsers,
    searchedUsers,
  };
};
