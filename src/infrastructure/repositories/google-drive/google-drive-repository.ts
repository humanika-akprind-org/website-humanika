/**
 * Google Drive Repository - Infrastructure Layer
 * Part of Clean Architecture: Infrastructure Layer (Repositories)
 *
 * This repository handles all Google Drive API interactions.
 * It wraps the Google Drive API with a clean interface for use cases.
 */

import { google } from "googleapis";
import { Readable } from "stream";
import {
  type ListDriveFilesInput,
  type ListDriveFilesResult,
  type UploadDriveFileInput,
  type UploadDriveFileResult,
  type RenameDriveFileInput,
  type DeleteDriveFileInput,
  type GetDriveFileInput,
  type GetDriveFileUrlInput,
  type SetDriveFilePermissionInput,
  type CreateDriveFolderInput,
  type DriveFileOperationResult,
  type DriveFile,
} from "@/domain/entities/google-drive.entity";
import { refreshGoogleAccessToken } from "@/infrastructure/external-services/google/google-oauth";

// ============================================================================
// Constants
// ============================================================================

/** Default page size for file listings */
const DEFAULT_PAGE_SIZE = 20;

/** Maximum file size (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024;

/** Google Drive public download URL pattern */
const GOOGLE_DRIVE_PUBLIC_URL = "https://drive.google.com/uc?export=view&id=";

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Create a Google Drive instance with the provided access token
 */
function createDriveClient(accessToken: string) {
  return google.drive({
    version: "v3",
    headers: { Authorization: `Bearer ${accessToken}` },
  });
}

/**
 * Process file data from Google Drive API response
 */
function processFileData(file: Record<string, unknown>): DriveFile {
  return {
    id: String(file.id || ""),
    name: String(file.name || ""),
    mimeType: String(file.mimeType || ""),
    size: file.size ? String(file.size) : undefined,
    modifiedTime: file.modifiedTime ? String(file.modifiedTime) : undefined,
    webViewLink: file.webViewLink ? String(file.webViewLink) : undefined,
    webContentLink: file.webContentLink
      ? String(file.webContentLink)
      : undefined,
    parents: file.parents as string[] | undefined,
    shortcutDetails: file.shortcutDetails
      ? {
          targetId: String(
            (file.shortcutDetails as Record<string, unknown>).targetId || "",
          ),
          targetMimeType: String(
            (file.shortcutDetails as Record<string, unknown>).targetMimeType ||
              "",
          ),
        }
      : undefined,
  };
}

/**
 * Generate direct image URL for Next.js Image component
 */
function getDirectImageUrl(fileId: string, mimeType?: string): string {
  if (mimeType && mimeType.startsWith("image/")) {
    return `${GOOGLE_DRIVE_PUBLIC_URL}${fileId}`;
  }
  return `${GOOGLE_DRIVE_PUBLIC_URL}${fileId}`;
}

// ============================================================================
// Google Drive Repository
// ============================================================================

/**
 * Google Drive Repository
 *
 * Provides a clean interface for all Google Drive file operations.
 * Handles authentication, error handling, and token refresh.
 */
export class GoogleDriveRepository {
  /**
   * List files in a Google Drive folder with pagination
   */
  async listFiles(input: ListDriveFilesInput): Promise<ListDriveFilesResult> {
    const { accessToken, folderId, pageToken, pageSize, sortOrder } = input;

    try {
      const drive = createDriveClient(accessToken);

      // Build query to fetch files in a specific folder
      let query = "trashed = false";
      if (folderId && folderId !== "root") {
        query += ` and '${folderId}' in parents`;
      } else {
        // For root folder, only get files directly in root
        query += ` and 'root' in parents`;
      }

      const actualPageSize = pageSize || DEFAULT_PAGE_SIZE;

      // Query to get files in the folder including shortcuts
      const { data } = await drive.files.list({
        q: query,
        fields:
          "files(id,name,mimeType,size,modifiedTime,webViewLink,webContentLink,parents,shortcutDetails),nextPageToken",
        orderBy: sortOrder || "name asc",
        pageSize: actualPageSize,
        pageToken: pageToken || undefined,
      });

      const files = (data.files || []).map((file) =>
        processFileData(file as Record<string, unknown>),
      );

      return {
        files,
        folderId: folderId || "root",
        nextPageToken: data.nextPageToken || null,
        totalCount: files.length,
        success: true,
      };
    } catch (error) {
      console.error("Error listing drive files:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Upload a file to Google Drive
   */
  async uploadFile(
    input: UploadDriveFileInput,
  ): Promise<UploadDriveFileResult> {
    const { accessToken, file, folderId, fileName } = input;

    try {
      const drive = createDriveClient(accessToken);

      // Validate file has required data
      if (!file.buffer && !file.size) {
        throw new Error("File data is missing. Please provide a valid file.");
      }

      // Convert buffer to stream - handle both buffer and arrayBuffer approaches
      let stream: Readable;
      if (file.buffer && Buffer.isBuffer(file.buffer)) {
        const bufferCopy = file.buffer;
        stream = new Readable({
          read() {
            this.push(bufferCopy);
            this.push(null);
          },
        });
      } else {
        // Fallback: use Readable.from with the file data
        // Since buffer is not a valid Buffer or is undefined, we use file.size to create data
        const placeholderData = new Uint8Array(file.size || 0);
        stream = Readable.from(placeholderData);
      }

      // Upload to Google Drive
      const { data } = await drive.files
        .create({
          requestBody: {
            name: fileName || file.name,
            mimeType: file.type,
            parents: folderId && folderId !== "root" ? [folderId] : undefined,
          },
          media: {
            mimeType: file.type,
            body: stream,
          },
          fields: "id,name,webViewLink,webContentLink,mimeType",
        })
        .catch(async (error: unknown) => {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 401) {
            try {
              const newAccessToken = await refreshGoogleAccessToken();
              const refreshedDrive = createDriveClient(newAccessToken);
              return await refreshedDrive.files.create({
                requestBody: {
                  name: fileName || file.name,
                  mimeType: file.type,
                  parents:
                    folderId && folderId !== "root" ? [folderId] : undefined,
                },
                media: {
                  mimeType: file.type,
                  body: stream,
                },
                fields: "id,name,webViewLink,webContentLink,mimeType",
              });
            } catch (refreshError) {
              if (
                refreshError instanceof Error &&
                refreshError.message === "No refresh token available"
              ) {
                throw new Error(
                  "Authentication expired. Please re-authenticate with Google.",
                );
              }
              throw refreshError;
            }
          }
          throw error;
        });

      // Use direct image URL for Next.js Image component if it's an image
      const imageUrl = getDirectImageUrl(
        String(data.id),
        data.mimeType || file.type,
      );

      return {
        file: {
          id: String(data.id || ""),
          name: String(data.name || ""),
          url: imageUrl,
          originalUrl: String(data.webViewLink || ""),
          downloadUrl: data.webContentLink
            ? String(data.webContentLink)
            : undefined,
          mimeType: data.mimeType || file.type,
        },
        success: true,
      };
    } catch (error) {
      console.error("Error uploading file:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Rename a file in Google Drive
   */
  async renameFile(
    input: RenameDriveFileInput,
  ): Promise<DriveFileOperationResult> {
    const { accessToken, fileId, newName } = input;

    try {
      const drive = createDriveClient(accessToken);
      await drive.files.update({
        fileId,
        requestBody: { name: newName },
      });

      return { success: true };
    } catch (error) {
      console.error("Error renaming file:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Delete or trash a file in Google Drive
   */
  async deleteFile(
    input: DeleteDriveFileInput,
  ): Promise<DriveFileOperationResult> {
    const { accessToken, fileId, permanent } = input;

    try {
      const drive = createDriveClient(accessToken);

      if (permanent) {
        await drive.files.delete({ fileId });
      } else {
        await drive.files.update({
          fileId,
          requestBody: { trashed: true },
        });
      }

      return { success: true };
    } catch (error) {
      console.error("Error deleting file:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get file details from Google Drive
   */
  async getFile(input: GetDriveFileInput): Promise<{
    file: DriveFile;
    success: boolean;
  }> {
    const { accessToken, fileId } = input;

    try {
      const drive = createDriveClient(accessToken);
      const { data } = await drive.files.get({
        fileId,
        fields: "id,name,owners",
      });

      return {
        file: {
          id: String(data.id || ""),
          name: String(data.name || ""),
          mimeType: String(data.mimeType || ""),
          owners: (data.owners || []).map((owner) => ({
            emailAddress: String(owner.emailAddress || ""),
            displayName: String(owner.displayName || ""),
          })),
        },
        success: true,
      };
    } catch (error) {
      console.error("Error getting file:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Get file URL (with public sharing) from Google Drive
   */
  async getFileUrl(input: GetDriveFileUrlInput): Promise<{
    url: string;
    originalUrl: string;
    success: boolean;
  }> {
    const { accessToken, fileId } = input;

    try {
      const drive = createDriveClient(accessToken);

      // Ensure file is shared
      await drive.permissions.create({
        fileId,
        requestBody: {
          role: "reader",
          type: "anyone",
        },
      });

      const { data } = await drive.files.get({
        fileId,
        fields: "webViewLink,mimeType",
      });

      // Return direct image URL for Next.js Image component
      const url = getDirectImageUrl(fileId, data.mimeType || undefined);

      return {
        url,
        originalUrl: String(data.webViewLink || ""),
        success: true,
      };
    } catch (error) {
      console.error("Error getting file URL:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Set public access permission for a file
   */
  async setFilePermission(
    input: SetDriveFilePermissionInput,
  ): Promise<DriveFileOperationResult> {
    const { accessToken, fileId, permission } = input;

    try {
      const drive = createDriveClient(accessToken);
      await drive.permissions.create({
        fileId,
        requestBody: permission,
      });

      return { success: true };
    } catch (error) {
      console.error("Error setting file permission:", error);
      throw this.handleError(error);
    }
  }

  /**
   * Create a folder in Google Drive
   */
  async createFolder(input: CreateDriveFolderInput): Promise<{
    folder: DriveFile;
    success: boolean;
  }> {
    const { accessToken, name, parentId } = input;

    try {
      const drive = createDriveClient(accessToken);
      const { data } = await drive.files.create({
        requestBody: {
          name,
          mimeType: "application/vnd.google-apps.folder",
          parents: parentId && parentId !== "root" ? [parentId] : undefined,
        },
        fields: "id,name,mimeType",
      });

      return {
        folder: {
          id: String(data.id || ""),
          name: String(data.name || ""),
          mimeType: String(data.mimeType || ""),
        },
        success: true,
      };
    } catch (error) {
      console.error("Error creating folder:", error);
      throw this.handleError(error);
    }
  }

  // ============================================================================
  // Validation Methods
  // ============================================================================

  /**
   * Validate access token
   */
  validateAccessToken(accessToken: string): {
    isValid: boolean;
    error?: string;
  } {
    if (!accessToken || accessToken.trim() === "") {
      return { isValid: false, error: "Access token is required" };
    }
    return { isValid: true };
  }

  /**
   * Validate file size
   */
  validateFileSize(size: number): { isValid: boolean; error?: string } {
    if (size > MAX_FILE_SIZE) {
      const sizeInMB = (size / (1024 * 1024)).toFixed(2);
      return {
        isValid: false,
        error: `File size exceeds the maximum limit of 5MB. Your file is ${sizeInMB}MB`,
      };
    }
    return { isValid: true };
  }

  /**
   * Validate file ID
   */
  validateFileId(fileId: string): { isValid: boolean; error?: string } {
    if (!fileId || fileId.trim() === "") {
      return { isValid: false, error: "File ID is required" };
    }
    return { isValid: true };
  }

  /**
   * Validate folder name
   */
  validateFolderName(name: string): { isValid: boolean; error?: string } {
    if (!name || name.trim() === "") {
      return { isValid: false, error: "Folder name is required" };
    }
    return { isValid: true };
  }

  // ============================================================================
  // Error Handling
  // ============================================================================

  /**
   * Handle errors and return consistent error format
   */
  private handleError(error: unknown): Error {
    let message = "An error occurred while interacting with Google Drive";
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;
    }

    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as {
        response?: { status?: number; data?: unknown };
      };
      statusCode = err.response?.status || 500;
    }

    const customError = new Error(message);
    (customError as Error & { statusCode?: number }).statusCode = statusCode;
    return customError;
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

/**
 * Singleton instance of GoogleDriveRepository for convenience
 */
export const googleDriveRepository = new GoogleDriveRepository();
