import { apiUrl } from "@/presentation/lib/config/config";

const API_URL = apiUrl;

export interface DriveImageMetadata {
  fileId: string;
  name?: string;
  mimeType?: string;
  size?: number;
  webViewLink?: string;
  webContentLink?: string;
}

export interface DriveImageUploadResponse {
  success: boolean;
  data?: DriveImageMetadata;
  message?: string;
  error?: string;
}

export interface DriveImageListResponse {
  success: boolean;
  data?: DriveImageMetadata[];
  message?: string;
  error?: string;
}

export const uploadDriveImage = async (
  file: File,
): Promise<{ data?: DriveImageMetadata; error?: string }> => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await fetch(`${API_URL}/drive-image`, {
      method: "POST",
      body: formData,
    });

    const result: DriveImageUploadResponse = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to upload image" };
    }

    return { data: result.data };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const getDriveImageMetadata = async (
  fileId: string,
): Promise<{ data?: DriveImageMetadata; error?: string }> => {
  try {
    const response = await fetch(
      `${API_URL}/drive-image/metadata?fileId=${fileId}`,
    );

    const result = await response.json();

    if (!response.ok) {
      return { error: result.error || "Failed to get image metadata" };
    }

    return { data: result };
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const deleteDriveImage = async (
  fileId: string,
): Promise<{ success: boolean; error?: string }> => {
  try {
    const response = await fetch(`${API_URL}/drive-image?fileId=${fileId}`, {
      method: "DELETE",
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        error: result.error || "Failed to delete image",
      };
    }

    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Network error occurred",
    };
  }
};

export const DriveImageApi = {
  uploadDriveImage,
  getDriveImageMetadata,
  deleteDriveImage,
};
