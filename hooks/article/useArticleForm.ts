import { useState, useEffect } from "react";
import type {
  Article,
  CreateArticleInput,
  UpdateArticleInput,
} from "@/types/article";
import { Status } from "@/types/enums";
import { useFile } from "@/hooks/useFile";
import { articleFolderId } from "@/lib/config/config";
import type { Period } from "@/types/period";
import { usePeriodManagement } from "@/hooks/period/usePeriodManagement";
import { useArticleCategoryManagement } from "@/hooks/article-category/useArticleCategoryManagement";
import { getAccessTokenAction } from "@/lib/actions/accessToken";
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
  currentUser?: User | null
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
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [existingThumbnail, setExistingThumbnail] = useState<
    string | null | undefined
  >(article?.thumbnail);
  const [removedThumbnail, setRemovedThumbnail] = useState(false);

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
    }
  }, [photoError]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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
    if (!formData.title.trim()) {
      setError("Please enter article title");
      return false;
    }
    if (isHtmlEmpty(formData.content)) {
      setError("Please enter article content");
      return false;
    }
    if (!formData.categoryId) {
      setError("Please select category");
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
        if (article?.thumbnail && isGoogleDriveThumbnail(article.thumbnail)) {
          const fileId = getFileIdFromThumbnail(article.thumbnail);
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
          article?.thumbnail &&
          isGoogleDriveThumbnail(article.thumbnail)
        ) {
          const fileId = getFileIdFromThumbnail(article.thumbnail);
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
          articleFolderId
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
            thumbnailUrl = uploadedFileId;
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

  return {
    formData,
    setFormData,
    isSubmitting,
    error,
    previewUrl,
    existingThumbnail,
    removedThumbnail,
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
