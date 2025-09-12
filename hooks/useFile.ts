import { useState } from "react";
import { callApi } from "@/lib/api/google-drive";

export function useFile(accessToken: string): {
  isLoading: boolean;
  error: string | null;
  uploadFile: (
    file: File,
    fileName: string,
    folderId: string
  ) => Promise<string | null>;
  deleteFile: (fileId: string) => Promise<boolean>;
  renameFile: (fileId: string, newName: string) => Promise<boolean>;
  setPublicAccess: (fileId: string) => Promise<boolean>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    fileName: string,
    folderId: string
  ): Promise<string | null> => {
    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("action", "upload");
      formData.append("accessToken", accessToken);
      formData.append("folderId", folderId);
      formData.append("fileName", fileName);

      const result = await callApi(
        {
          action: "upload",
          accessToken,
        },
        formData
      );

      if (result.success && result.file) {
        // Return only the file ID instead of the full URL
        return result.file.id;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Photo upload error:", err);
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
      return null;
    } finally {
      console.log("Uploading file:", fileName, "to folder:", folderId);
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi({
        action: "delete",
        fileId,
        accessToken,
      });
      return true;
    } catch (err) {
      console.error("Photo delete error:", err);
      setError(
        err instanceof Error ? err.message : "Delete failed. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renameFile = async (
    fileId: string,
    newName: string
  ): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi({
        action: "rename",
        fileId,
        fileName: newName,
        accessToken,
      });
      return true;
    } catch (err) {
      console.error("Photo rename error:", err);
      setError(
        err instanceof Error ? err.message : "Rename failed. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setPublicAccess = async (fileId: string): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi({
        action: "setPublicAccess",
        fileId,
        accessToken,
        permission: {
          type: "anyone",
          role: "reader",
          allowFileDiscovery: false,
        },
      });
      return true;
    } catch (err) {
      console.error("Set public access error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to set public access. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    uploadFile,
    deleteFile,
    renameFile,
    setPublicAccess,
  };
}
