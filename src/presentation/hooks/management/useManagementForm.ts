import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import type {
  Management,
  ManagementFormData,
  ManagementServerData,
} from "@/src/domain/entities/management";
import { Position, Department } from "@/src/domain/enums/enums";
import type { User } from "@/src/domain/entities/user";
import type { Period } from "@/src/domain/entities/period";
import { useFile } from "@/src/presentation/hooks/useFile";
import { photoManagementFolderId } from "@/src/presentation/lib/config/config";
import { getAccessTokenAction } from "@/src/presentation/lib/actions/accessToken";
import { UserApi } from "@/src/presentation/use-cases/api/user";
import { PeriodApi } from "@/src/presentation/use-cases/api/period";
import type { AlertType } from "@/src/presentation/components/admin/ui/alert/Alert";

export const useManagementForm = (
  management: Management | undefined,
  onSubmit: (data: ManagementServerData) => Promise<void>,
) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);
  const [userSearchQuery, setUserSearchQuery] = useState("");
  const [userPage, setUserPage] = useState(1);
  const [isLoadingUsers, setIsLoadingUsers] = useState(false);
  const [hasMoreUsers, setHasMoreUsers] = useState(true);

  const {
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
    getFileDetails,
    isLoading: photoLoading,
    error: photoError,
  } = useFile(accessToken);

  const [formData, setFormData] = useState<ManagementFormData>({
    userId: management?.userId || "",
    periodId: management?.periodId || "",
    position: management?.position || Position.STAFF_DEPARTEMEN,
    department: management?.department || Department.INFOKOM,
    photoFile: undefined,
  });

  const [isLoading, setIsLoading] = useState(false);
  const [_error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null | undefined>(
    management?.photo,
  );
  const [removedPhoto, setRemovedPhoto] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  // Fetch access token
  useEffect(() => {
    const fetchAccessToken = async () => {
      const token = await getAccessTokenAction();
      setAccessToken(token);
    };
    fetchAccessToken();
  }, []);

  // Fetch initial data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersResponse, periodsResponse] = await Promise.all([
          UserApi.getUsers({ allUsers: true }),
          PeriodApi.getPeriods(),
        ]);

        setUsers(usersResponse.data?.users || []);
        setPeriods(periodsResponse);
      } catch (err) {
        console.error("Error loading form data:", err);
      }
    };

    fetchData();
  }, []);

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

  const removePhoto = () => {
    if (existingPhoto) {
      // Mark photo as removed for deletion during form submission
      setRemovedPhoto(true);
    }

    // Clear form state
    setFormData((prev) => ({ ...prev, photoFile: undefined }));
    setPreviewUrl(null);
    setExistingPhoto(null);
  };

  // Function to fetch file owner when there's an existing photo
  const fetchFileOwner = useCallback(async () => {
    // Wait for token to be available
    if (!accessToken) {
      // Token not yet available, will be fetched by useEffect when it becomes available
      return;
    }

    if (existingPhoto && isGoogleDrivePhoto(existingPhoto)) {
      const fileId = getFileIdFromPhoto(existingPhoto);
      if (fileId) {
        try {
          const ownerInfo = await getFileDetails(fileId, accessToken);
          if (ownerInfo?.emailAddress) {
            setOwnerEmail(ownerInfo.emailAddress);
          }
        } catch (err) {
          console.warn("Failed to fetch file owner:", err);
        }
      }
    }
  }, [existingPhoto, accessToken, getFileDetails]);

  // Fetch file owner on mount if there's an existing photo
  useEffect(() => {
    if (existingPhoto) {
      fetchFileOwner();
    }
  }, [existingPhoto, fetchFileOwner]);

  // Fetch file owner when token becomes available
  useEffect(() => {
    if (accessToken && existingPhoto) {
      fetchFileOwner();
    }
  }, [accessToken, existingPhoto, fetchFileOwner]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setErrors({});
    setAlert(null);

    try {
      // Validate required fields
      if (!formData.userId) {
        setErrors((prev) => ({ ...prev, userId: "Please select a user" }));
        throw new Error("Please select a user");
      }
      if (!formData.periodId) {
        setErrors((prev) => ({ ...prev, periodId: "Please select a period" }));
        throw new Error("Please select a period");
      }

      // Upload photo first if provided
      let photoUrl: string | null | undefined = existingPhoto;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedPhoto && management?.photo
          ? getFileIdFromPhoto(management.photo)
          : null;

      if (removedPhoto) {
        photoUrl = null;
      }

      if (formData.photoFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.photoFile,
          tempFileName,
          photoManagementFolderId,
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `management_${formData.userId}_${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            // Set public access for the photo
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (!publicAccessSuccess) {
              console.warn("Failed to set public access for photo");
            }
            photoUrl = uploadedFileId;

            // Delete old photo IMMEDIATELY after successful upload
            if (oldFileId) {
              try {
                await deleteFile(oldFileId);
              } catch (err) {
                console.warn("Failed to delete old photo (non-critical):", err);
              }
            }
          } else {
            // Clean up uploaded file if rename fails
            await deleteFile(uploadedFileId).catch((err) => {
              console.warn("Failed to clean up uploaded photo:", err);
            });
            throw new Error("Failed to rename photo");
          }
        } else {
          throw new Error("Failed to upload photo");
        }
      } else if (removedPhoto && oldFileId) {
        // Delete old photo if no new file uploaded
        try {
          await deleteFile(oldFileId);
        } catch (deleteError) {
          console.warn("Failed to delete photo:", deleteError);
        }
      }

      // Submit form data with photo URL (exclude photoFile for server action)
      const { photoFile: _, ...dataToSend } = formData;
      await onSubmit({
        ...dataToSend,
        photo: photoUrl || null,
      });

      // If there was a file uploaded, run removePhoto logic to clean up form state
      if (formData.photoFile) {
        removePhoto();
      }

      setRemovedPhoto(false);
      setAlert({
        type: "success",
        message: "Management created successfully!",
      });
      router.push("/admin/governance/managements");
    } catch (err) {
      setAlert({
        type: "error",
        message:
          err instanceof Error ? err.message : "Failed to save management",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (file: File) => {
    // Validasi file
    if (file.size > 5 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        photo: "File size must be less than 5MB",
      }));
      return;
    }

    if (!file.type.startsWith("image/")) {
      setErrors((prev) => ({
        ...prev,
        photo: "Please select an image file",
      }));
      return;
    }

    setFormData((prev) => ({ ...prev, photoFile: file }));
    setError(null);
    setErrors((prev) => ({ ...prev, photo: "" }));
    setRemovedPhoto(false); // Reset removed state when new file is selected

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  // Helper function to get file ID from photo (either URL or file ID)
  const getFileIdFromPhoto = (
    photo: string | null | undefined,
  ): string | null => {
    if (!photo) return null;

    if (photo.includes("drive.google.com")) {
      const fileIdMatch = photo.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
      return fileIdMatch ? fileIdMatch[1] : null;
    } else if (photo.match(/^[a-zA-Z0-9_-]+$/)) {
      return photo;
    }
    return null;
  };

  // Helper function to check if photo is from Google Drive
  const isGoogleDrivePhoto = (photo: string | null | undefined): boolean => {
    if (!photo) return false;
    return photo.includes("drive.google.com");
  };

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
      setUsers(response.data?.users || []);
      setHasMoreUsers(false); // All users are loaded, no need for load more
    } catch (err) {
      console.error("Error searching users:", err);
      setUsers([]);
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
      setUsers((prev) => {
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
    users,
    periods,
    accessToken,
    isLoading,
    alert,
    errors,
    previewUrl,
    existingPhoto,
    ownerEmail,
    photoLoading,
    removePhoto,
    handleSubmit,
    handleFileChange,
    loadMoreUsers,
    searchUsers,
    isLoadingUsers,
    hasMoreUsers,
  };
};
