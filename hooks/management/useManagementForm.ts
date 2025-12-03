import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import type {
  Management,
  ManagementFormData,
  ManagementServerData,
} from "@/types/management";
import { Position, Department } from "@/types/enums";
import type { User } from "@/types/user";
import type { Period } from "@/types/period";
import { useFile } from "@/hooks/useFile";
import { photoManagementFolderId } from "@/lib/config/config";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
import { UserApi } from "@/use-cases/api/user";
import { PeriodApi } from "@/use-cases/api/period";
import type { AlertType } from "@/components/admin/ui/alert/Alert";

export const useManagementForm = (
  management: Management | undefined,
  onSubmit: (data: ManagementServerData) => Promise<void>
) => {
  const router = useRouter();
  const [accessToken, setAccessToken] = useState<string>("");
  const [users, setUsers] = useState<User[]>([]);
  const [periods, setPeriods] = useState<Period[]>([]);

  const {
    uploadFile,
    renameFile,
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
  const [alert, setAlert] = useState<{
    type: AlertType;
    message: string;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingPhoto, setExistingPhoto] = useState<string | null | undefined>(
    management?.photo
  );

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
          UserApi.getUsers({ limit: 50 }),
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
    }
  }, [photoError]);

  const removePhoto = () => {
    // If it's a local file or no photo, just remove it
    setFormData((prev) => ({ ...prev, photoFile: undefined }));
    setPreviewUrl(null);
    setExistingPhoto(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setAlert(null);

    try {
      // Validate required fields
      if (!formData.userId) {
        throw new Error("Please select a user");
      }
      if (!formData.periodId) {
        throw new Error("Please select a period");
      }

      // Upload photo first if provided
      let photoUrl: string | null | undefined = existingPhoto;

      if (formData.photoFile) {
        // Upload with temporary filename first
        const tempFileName = `temp_${Date.now()}`;
        const uploadedFileId = await uploadFile(
          formData.photoFile,
          tempFileName,
          photoManagementFolderId
        );

        if (uploadedFileId) {
          // Rename the file using the renameFile hook
          const finalFileName = `management_${formData.userId}_${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            photoUrl = uploadedFileId;
          } else {
            throw new Error("Failed to rename photo");
          }
        } else {
          throw new Error("Failed to upload photo");
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
      setError("File size must be less than 5MB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("Please select an image file");
      return;
    }

    setFormData((prev) => ({ ...prev, photoFile: file }));
    setError(null);

    // Create preview URL
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
  };

  return {
    formData,
    setFormData,
    users,
    periods,
    accessToken,
    isLoading,
    alert,
    previewUrl,
    existingPhoto,
    photoLoading,
    removePhoto,
    handleSubmit,
    handleFileChange,
  };
};
