import { useState, useEffect, useCallback } from "react";
import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import {
  callApi,
  fetchDriveFiles,
  fetchDriveFolders,
} from "@/lib/api/google-drive";
import {
  loadFolderFromLocalStorage,
  saveFolderToLocalStorage,
} from "@/app/utils/google-drive";
import type { LoadingStateTable } from "@/types/google-drive";

export const useGoogleDriveFiles = (
  accessToken: string,
  initialFiles: drive_v3.Schema$File[] = []
) => {
  const [files, setFiles] = useState<drive_v3.Schema$File[]>(initialFiles);
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [selectedFolderId] = useState<string>(
    loadFolderFromLocalStorage() || "root"
  );
  const [isLoading, setIsLoading] = useState<LoadingStateTable>({
    files: false,
    folders: false,
    operations: false,
  });
  const [error, setError] = useState<string | null>(null);

  const setLoadingState = (key: keyof LoadingStateTable, value: boolean) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  const fetchFiles = useCallback(async () => {
    setLoadingState("files", true);
    setError(null);

    try {
      const filesData = await fetchDriveFiles(accessToken);
      setFiles(filesData);
    } catch (err) {
      console.error("Error fetching files:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load files. Please try again."
      );
    } finally {
      setLoadingState("files", false);
    }
  }, [accessToken]);

  const fetchFolders = useCallback(async () => {
    setLoadingState("folders", true);
    setError(null);

    try {
      const foldersData = await fetchDriveFolders(accessToken);
      setFolders(foldersData);
    } catch (err) {
      console.error("Error fetching folders:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to load folders. Please try again."
      );
    } finally {
      setLoadingState("folders", false);
    }
  }, [accessToken]);

  useEffect(() => {
    fetchFiles();
    fetchFolders();
  }, [fetchFiles, fetchFolders]);

  useEffect(() => {
    if (selectedFolderId) {
      saveFolderToLocalStorage(selectedFolderId);
    }
  }, [selectedFolderId]);

  return {
    files,
    folders,
    isLoading,
    error,
    fetchFiles,
    fetchFolders,
    setLoadingState,
    setError,
  };
};

export const useFileOperations = (
  accessToken: string,
  refreshFiles: () => Promise<void>
) => {
  const [copiedFileId, setCopiedFileId] = useState<string | null>(null);
  const [isOperating, setIsOperating] = useState(false);
  const [operationError, setOperationError] = useState<string | null>(null);

  const handleApiOperation = async (
    operation: () => Promise<void>,
    _successMessage?: string
  ) => {
    setIsOperating(true);
    setOperationError(null);

    try {
      await operation();
      await refreshFiles();
    } catch (err) {
      console.error("Operation error:", err);
      setOperationError(
        err instanceof Error
          ? err.message
          : "Operation failed. Please try again."
      );
    } finally {
      setIsOperating(false);
    }
  };

  const handleCopyUrl = async (fileId?: string | null) => {
    if (!fileId) return;

    setIsOperating(true);
    setOperationError(null);

    try {
      const res = await callApi({
        action: "getUrl",
        fileId,
        accessToken,
      });

      if (res.success && res.url) {
        await navigator.clipboard.writeText(res.url);
        setCopiedFileId(fileId);
        setTimeout(() => setCopiedFileId(null), 2000);
      } else {
        throw new Error(res.message || "Failed to get file URL");
      }
    } catch (err) {
      console.error("Error copying URL:", err);
      setOperationError(
        err instanceof Error
          ? err.message
          : "Failed to copy URL. Please try again."
      );
    } finally {
      setIsOperating(false);
    }
  };

  return {
    copiedFileId,
    isOperating,
    operationError,
    handleApiOperation,
    handleCopyUrl,
    setOperationError,
  };
};
