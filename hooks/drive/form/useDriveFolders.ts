import { useState, useCallback } from "react";
import { fetchDriveFolders } from "@/lib/api/google-drive";
import type { drive_v3 } from "googleapis/build/src/apis/drive/v3";
import type { UseDriveFoldersReturn } from "@/types/google-drive";

export function useDriveFolders(accessToken: string): UseDriveFoldersReturn {
  const [folders, setFolders] = useState<drive_v3.Schema$File[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchFolders = useCallback(async () => {
    if (!accessToken) return;

    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [accessToken]);

  return {
    folders,
    isLoading,
    error,
    fetchFolders,
  };
}
