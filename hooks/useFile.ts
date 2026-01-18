import { useState } from "react";
import { callApi } from "@/use-cases/api/google-drive";

export interface FileOwnerInfo {
  emailAddress?: string;
  displayName?: string;
}

export function useFile(accessToken?: string): {
  isLoading: boolean;
  error: string | null;
  uploadFile: (
    file: File,
    fileName: string,
    folderId: string,
  ) => Promise<string | null>;
  deleteFile: (fileId: string) => Promise<boolean>;
  trashFile: (fileId: string) => Promise<boolean>;
  renameFile: (fileId: string, newName: string) => Promise<boolean>;
  setPublicAccess: (fileId: string) => Promise<boolean>;
  getFileDetails: (fileId: string) => Promise<FileOwnerInfo | null>;
} {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const uploadFile = async (
    file: File,
    fileName: string,
    folderId: string,
  ): Promise<string | null> => {
    if (!accessToken) {
      setError("Access token is required for file upload");
      return null;
    }

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
        formData,
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
        err instanceof Error ? err.message : "Upload failed. Please try again.",
      );
      return null;
    } finally {
      console.log("Uploading file:", fileName, "to folder:", folderId);
      setIsLoading(false);
    }
  };

  const deleteFile = async (fileId: string): Promise<boolean> => {
    if (!accessToken) {
      setError("Access token is required for file deletion");
      return false;
    }

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

      // Extract status code and error message
      const statusCode =
        typeof err === "object" && err !== null && "status" in err
          ? (err as { status?: number }).status
          : null;
      const errorMessage = err instanceof Error ? err.message : String(err);

      // Check if it's a 403 error (not owner or insufficient permissions)
      const is403Error =
        statusCode === 403 ||
        errorMessage.toLowerCase().includes("insufficient permissions") ||
        errorMessage.toLowerCase().includes("permission") ||
        errorMessage.toLowerCase().includes("403");

      if (is403Error) {
        // Try to get owner info for 403 error
        let ownerEmail = "";
        try {
          const detailsResult = await callApi({
            action: "get",
            fileId,
            accessToken,
          });
          if (
            detailsResult.success &&
            detailsResult.file?.owners?.[0]?.emailAddress
          ) {
            ownerEmail = detailsResult.file.owners[0].emailAddress;
          }
        } catch (getOwnerErr) {
          console.error("Failed to get file owner:", getOwnerErr);
        }

        console.log("Not file owner, trying to trash instead");

        // Try to trash the file
        try {
          await callApi({
            action: "trash",
            fileId,
            accessToken,
          });
          return true;
        } catch (trashErr) {
          console.error("Photo trash error:", trashErr);
          const trashErrorMessage =
            trashErr instanceof Error ? trashErr.message : String(trashErr);

          // Check if trash also failed due to permissions
          const isTrash403 =
            (typeof trashErr === "object" &&
              trashErr !== null &&
              "status" in trashErr &&
              (trashErr as { status?: number }).status === 403) ||
            trashErrorMessage
              .toLowerCase()
              .includes("insufficient permissions") ||
            trashErrorMessage.toLowerCase().includes("permission");

          if (ownerEmail || isTrash403) {
            const finalEmail = ownerEmail || "the file owner";
            const finalError = new Error(
              `You don't have permission to delete this file. Use email ${finalEmail} to edit or delete this thumbnail.`,
            );
            // Attach owner email to error for better handling
            (finalError as Error & { ownerEmail?: string }).ownerEmail =
              ownerEmail;
            throw finalError;
          }

          setError(trashErrorMessage || "Trash failed. Please try again.");
          return false;
        }
      }

      setError(errorMessage || "Delete failed. Please try again.");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const trashFile = async (fileId: string): Promise<boolean> => {
    if (!accessToken) {
      setError("Access token is required for file trash");
      return false;
    }

    setIsLoading(true);
    setError(null);

    try {
      await callApi({
        action: "trash",
        fileId,
        accessToken,
      });
      return true;
    } catch (err) {
      console.error("Photo trash error:", err);
      setError(
        err instanceof Error ? err.message : "Trash failed. Please try again.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const renameFile = async (
    fileId: string,
    newName: string,
  ): Promise<boolean> => {
    if (!accessToken) {
      setError("Access token is required for file rename");
      return false;
    }

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
        err instanceof Error ? err.message : "Rename failed. Please try again.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const setPublicAccess = async (fileId: string): Promise<boolean> => {
    if (!accessToken) {
      setError("Access token is required for setting public access");
      return false;
    }

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
          allowFileDiscovery: true,
        },
      });
      return true;
    } catch (err) {
      console.error("Set public access error:", err);
      setError(
        err instanceof Error
          ? err.message
          : "Failed to set public access. Please try again.",
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const getFileDetails = async (
    fileId: string,
  ): Promise<FileOwnerInfo | null> => {
    if (!accessToken) {
      setError("Access token is required for getting file details");
      return null;
    }

    setIsLoading(true);
    setError(null);

    try {
      const result = await callApi({
        action: "get",
        fileId,
        accessToken,
      });

      if (result.success && result.file) {
        const owners = result.file.owners || [];
        const primaryOwner = owners[0];
        return {
          emailAddress: primaryOwner?.emailAddress,
          displayName: primaryOwner?.displayName,
        };
      }
      return null;
    } catch (err) {
      console.error("Get file details error:", err);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    error,
    uploadFile,
    deleteFile,
    trashFile,
    renameFile,
    setPublicAccess,
    getFileDetails,
  };
}
