import { useState } from "react";
import { callApi } from "@/lib/api/google-drive";
import type { UseFileOperationsReturn } from "@/types/google-drive";

export function useFileOperations(): UseFileOperationsReturn {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async ({
    file,
    fileName,
    folderId,
    accessToken,
  }: {
    file: File;
    fileName: string;
    folderId: string;
    accessToken: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      const renamedFile = new File([file], fileName, {
        type: file.type,
        lastModified: Date.now(),
      });

      const formData = new FormData();
      formData.append("file", renamedFile);
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

      if (result.success) {
        return true;
      } else {
        throw new Error(result.message || "Upload failed");
      }
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err instanceof Error ? err.message : "Upload failed. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renameFile = async ({
    fileId,
    fileName,
    accessToken,
  }: {
    fileId: string;
    fileName: string;
    accessToken: string;
  }): Promise<boolean> => {
    setIsLoading(true);
    setError(null);

    try {
      await callApi({
        action: "rename",
        fileId,
        fileName,
        accessToken,
      });
      return true;
    } catch (err) {
      console.error("Rename error:", err);
      setError(
        err instanceof Error ? err.message : "Rename failed. Please try again."
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const deleteFile = async ({
    fileId,
    accessToken,
  }: {
    fileId: string;
    accessToken: string;
  }): Promise<boolean> => {
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
      console.error("Delete error:", err);
      setError(
        err instanceof Error ? err.message : "Delete failed. Please try again."
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
    renameFile,
    deleteFile,
  };
}
