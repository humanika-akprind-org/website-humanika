import { useState, useEffect, useCallback, useRef } from "react";
import { type drive_v3 } from "googleapis/build/src/apis/drive/v3";
import { callApi, fetchDriveFolders } from "@/use-cases/api/google-drive";
import {
  loadFolderFromLocalStorage,
  saveFolderToLocalStorage,
} from "@/app/utils/google-drive";
import type { LoadingStateTable, BreadcrumbItem } from "@/types/google-drive";

export const useGoogleDriveFiles = (
  accessToken: string,
  initialFiles: drive_v3.Schema$File[] = [],
  pageSize: number = 20
) => {
  const [files, setFiles] = useState<drive_v3.Schema$File[]>(initialFiles);
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);

  // Folder navigation state
  const [currentFolderId, setCurrentFolderId] = useState<string>("root");
  const [folderPath, setFolderPath] = useState<BreadcrumbItem[]>([]);

  // Store all fetched files
  const allFilesRef = useRef<drive_v3.Schema$File[]>([]);

  const [isLoading, setIsLoading] = useState<LoadingStateTable>({
    files: false,
    folders: false,
    operations: false,
  });
  const [error, setError] = useState<string | null>(null);

  const setLoadingState = (key: keyof LoadingStateTable, value: boolean) => {
    setIsLoading((prev) => ({ ...prev, [key]: value }));
  };

  // Fetch all files for a specific folder (no pagination, fetch all at once)
  const fetchFilesForFolder = useCallback(
    async (folderId: string) => {
      setLoadingState("files", true);
      setError(null);

      try {
        let currentPageToken: string | null = null;
        let allFiles: drive_v3.Schema$File[] = [];
        let keepFetching = true;

        while (keepFetching) {
          const res: Response = await fetch(
            `/api/google-drive?accessToken=${accessToken}&folderId=${folderId}${
              currentPageToken ? `&pageToken=${currentPageToken}` : ""
            }&pageSize=${pageSize}`
          );
          const data = await res.json();

          if (!res.ok) {
            throw new Error(data.message || "Failed to fetch files");
          }

          if (data.files) {
            allFiles = [...allFiles, ...data.files];
          }

          currentPageToken = data.nextPageToken || null;
          keepFetching = !!data.nextPageToken;
        }

        // Reset - new folder, start fresh
        allFilesRef.current = allFiles;
        setFiles(allFiles);
        setCurrentFolderId(folderId);
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
    },
    [accessToken, pageSize]
  );

  const fetchFiles = useCallback(async () => {
    await fetchFilesForFolder(currentFolderId);
  }, [currentFolderId, fetchFilesForFolder]);

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

  // Navigate to a folder
  const navigateToFolder = useCallback(
    (folderId: string, folderName: string) => {
      // Reset files when navigating
      allFilesRef.current = [];
      setFiles([]);

      // Update path
      if (folderId === "root") {
        setFolderPath([]);
      } else {
        // Append the new folder to the current path
        setFolderPath((prev) => [...prev, { id: folderId, name: folderName }]);
      }

      // Navigate to the folder
      setCurrentFolderId(folderId);
      saveFolderToLocalStorage(folderId);
    },
    []
  );

  // Navigate to parent folder
  const navigateToParent = useCallback(() => {
    // Reset files when navigating
    allFilesRef.current = [];
    setFiles([]);

    if (folderPath.length === 0) {
      // Go back to root
      setCurrentFolderId("root");
      setFolderPath([]);
      saveFolderToLocalStorage("root");
      return;
    }

    // Get the parent folder from path
    const parentPath = folderPath.slice(0, -1);
    const parentFolder = parentPath[parentPath.length - 1];

    if (parentFolder) {
      setCurrentFolderId(parentFolder.id);
    } else {
      setCurrentFolderId("root");
    }

    setFolderPath(parentPath);
    saveFolderToLocalStorage(currentFolderId);
  }, [folderPath, currentFolderId]);

  // Navigate to any breadcrumb level
  const navigateToBreadcrumb = useCallback(
    (folderId: string) => {
      // Reset files when navigating
      allFilesRef.current = [];
      setFiles([]);

      if (folderId === "root") {
        setCurrentFolderId("root");
        setFolderPath([]);
        saveFolderToLocalStorage("root");
        return;
      }

      // Find this folder in the path
      const pathIndex = folderPath.findIndex((item) => item.id === folderId);

      if (pathIndex >= 0) {
        // Navigate to this level in the path
        const newPath = folderPath.slice(0, pathIndex + 1);
        setFolderPath(newPath);
        setCurrentFolderId(folderId);
      } else {
        // If not in path, navigate directly (shouldn't happen in normal use)
        setFolderPath([]);
        setCurrentFolderId(folderId);
      }

      saveFolderToLocalStorage(folderId);
    },
    [folderPath]
  );

  // Initial load - restore folder from localStorage
  useEffect(() => {
    const savedFolderId = loadFolderFromLocalStorage();
    if (savedFolderId && savedFolderId !== "root") {
      setCurrentFolderId(savedFolderId);
    }
  }, []);

  // Fetch files when folder changes (only on client-side)
  useEffect(() => {
    if (accessToken) {
      fetchFiles();
      fetchFolders();
    }
  }, [accessToken, fetchFiles, fetchFolders]);

  return {
    files,
    folders,
    isLoading,
    error,
    fetchFiles,
    fetchFolders,
    // Navigation state
    currentFolderId,
    folderPath,
    // Navigation functions
    navigateToFolder,
    navigateToParent,
    navigateToBreadcrumb,
    setLoadingState,
    setError,
    setFiles,
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
