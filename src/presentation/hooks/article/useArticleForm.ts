import { useState, useEffect, useCallback } from "react";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/types/article";
import { Status } from "@/types/enums";
import { useFile } from "@/src/presentation/hooks/useFile";
import { articleFolderId } from "@/src/presentation/lib/config/config";
import type { Period } from "@/types/period";
import { usePeriodManagement } from "@/src/presentation/hooks/period/usePeriodManagement";
import { useArticleCategoryManagement } from "@/src/presentation/hooks/article-category/useArticleCategoryManagement";
import { getAccessTokenAction } from "@/src/presentation/lib/actions/accessToken";
import { type User } from "@/types/user";

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

export interface ArticleFormData {
  title: string;
  content: string;
  authorId: string;
  categoryId: string;
  periodId: string;
  status: Status;
  thumbnailFile?: File;
}

export const useArticleForm = (
  article?: Article,
  onSubmit?: (data: CreateArticleInput | UpdateArticleInput) => Promise<void>,
  accessToken?: string,
  periods?: Period[],
  currentUser?: User | null,
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

  const { categories: articleCategories, loading: categoriesLoading } =
    useArticleCategoryManagement();

  const { periods: fetchedPeriods, loading: periodsLoading } =
    usePeriodManagement();

  const [formData, setFormData] = useState<ArticleFormData>({
    title: article?.title || "",
    content: article?.content || "",
    authorId: article?.author?.id || currentUser?.id || "",
    categoryId: article?.category?.id || "",
    periodId: article?.period?.id || "",
    status: article?.status || Status.DRAFT,
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<
    string | null | undefined
  >(article?.thumbnail);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);
  const [ownerEmail, setOwnerEmail] = useState<string | null>(null);

  // Initialize preview URL
  useEffect(() => {
    setPreviewUrl(getPreviewUrl(article?.thumbnail));
  }, [article?.thumbnail]);

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
    const { name, value, type } = e.target;
    const checked = (e.target as HTMLInputElement).checked;

    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
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

    if (!formData.title.trim()) {
      newErrors.title = "Please enter article title";
      isValid = false;
    }
    if (isHtmlEmpty(formData.content)) {
      newErrors.content = "Please enter article content";
      isValid = false;
    }
    if (!formData.categoryId) {
      newErrors.categoryId = "Please select category";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm() || !onSubmit) return;

    setIsSubmitting(true);
    setError(null);
    setOwnerEmail(null);

    try {
      let thumbnailUrl: string | null | undefined = existingThumbnail;

      // Store old file ID for deletion after successful upload
      const oldFileId =
        !removedThumbnail &&
        article?.thumbnail &&
        isGoogleDriveThumbnail(article.thumbnail)
          ? getFileIdFromThumbnail(article.thumbnail)
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
          articleFolderId,
        );

        if (uploadedFileId) {
          const finalFileName = `article-thumbnail-${formData.title
            .replace(/\s+/g, "-")
            .toLowerCase()}-${Date.now()}`;
          const renameSuccess = await renameFile(uploadedFileId, finalFileName);

          if (renameSuccess) {
            const publicAccessSuccess = await setPublicAccess(uploadedFileId);
            if (publicAccessSuccess) {
              thumbnailUrl = uploadedFileId;
            } else {
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
        periodId:
          formData.periodId && formData.periodId.trim() !== ""
            ? formData.periodId
            : undefined,
      };

      await onSubmit(submitData);
      setRemovedThumbnail(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save article");
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
    articleCategories,
    categoriesLoading,
    photoLoading,
    accessToken: accessToken || fetchedAccessToken,
    periods: periods || fetchedPeriods,
    periodsLoading,
    handleInputChange,
    handleFileChange,
    removeThumbnail,
    handleSubmit,
  };
};
