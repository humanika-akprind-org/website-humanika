/**
 * Google Drive Entity - Domain Layer
 * Part of Clean Architecture: Domain Layer (Entities)
 *
 * This file defines types for Google Drive file operations.
 */

// ============================================================================
// Enums
// ============================================================================

/**
 * Google Drive file actions
 */
export enum DriveAction {
  LIST = "list",
  UPLOAD = "upload",
  RENAME = "rename",
  DELETE = "delete",
  TRASH = "trash",
  GET = "get",
  GET_URL = "getUrl",
  SET_PUBLIC_ACCESS = "setPublicAccess",
  CREATE_FOLDER = "createFolder",
}

/**
 * Google Drive file sort order
 */
export enum DriveSortOrder {
  NAME_ASC = "name asc",
  NAME_DESC = "name desc",
  MODIFIED_TIME_ASC = "modifiedTime asc",
  MODIFIED_TIME_DESC = "modifiedTime desc",
}

// ============================================================================
// Input Types
// ============================================================================

/**
 * Input parameters for listing drive files
 */
export interface ListDriveFilesInput {
  /** Access token for Google API */
  accessToken: string;
  /** Folder ID to list files from (default: root) */
  folderId?: string;
  /** Page token for pagination */
  pageToken?: string;
  /** Number of files per page (default: 20) */
  pageSize?: number;
  /** Sort order */
  sortOrder?: DriveSortOrder;
}

/**
 * Input parameters for uploading a file
 */
export interface UploadDriveFileInput {
  /** Access token for Google API */
  accessToken: string;
  /** The file to upload */
  file: {
    name: string;
    type: string;
    size: number;
    buffer: Buffer;
  };
  /** Target folder ID */
  folderId?: string;
  /** Custom file name */
  fileName?: string;
}

/**
 * Input parameters for renaming a file
 */
export interface RenameDriveFileInput {
  /** Access token for Google API */
  accessToken: string;
  /** File ID to rename */
  fileId: string;
  /** New file name */
  newName: string;
}

/**
 * Input parameters for deleting/trashing a file
 */
export interface DeleteDriveFileInput {
  /** Access token for Google API */
  accessToken: string;
  /** File ID to delete */
  fileId: string;
  /** Whether to permanently delete or just trash */
  permanent?: boolean;
}

/**
 * Input parameters for getting file details
 */
export interface GetDriveFileInput {
  /** Access token for Google API */
  accessToken: string;
  /** File ID to get */
  fileId: string;
}

/**
 * Input parameters for getting file URL
 */
export interface GetDriveFileUrlInput {
  /** Access token for Google API */
  accessToken: string;
  /** File ID to get URL for */
  fileId: string;
}

/**
 * Input parameters for setting public access
 */
export interface SetDriveFilePermissionInput {
  /** Access token for Google API */
  accessToken: string;
  /** File ID to set permission */
  fileId: string;
  /** Permission object */
  permission: {
    role: string;
    type: string;
    value?: string;
  };
}

/**
 * Input parameters for creating a folder
 */
export interface CreateDriveFolderInput {
  /** Access token for Google API */
  accessToken: string;
  /** Folder name */
  name: string;
  /** Parent folder ID */
  parentId?: string;
}

// ============================================================================
// Result Types
// ============================================================================

/**
 * Result of listing drive files
 */
export interface ListDriveFilesResult {
  /** List of files */
  files: DriveFile[];
  /** Current folder ID */
  folderId: string;
  /** Next page token */
  nextPageToken: string | null;
  /** Total files count */
  totalCount: number;
  /** Success status */
  success: boolean;
}

/**
 * Result of uploading a file
 */
export interface UploadDriveFileResult {
  /** Uploaded file details */
  file: DriveUploadedFile;
  /** Success status */
  success: boolean;
}

/**
 * Result of file operation
 */
export interface DriveFileOperationResult {
  /** Success status */
  success: boolean;
  /** Error message if failed */
  error?: string;
  /** Additional data */
  data?: Record<string, unknown>;
}

// ============================================================================
// Domain Types
// ============================================================================

/**
 * Google Drive file model
 */
export interface DriveFile {
  /** File ID */
  id: string;
  /** File name */
  name: string;
  /** MIME type */
  mimeType: string;
  /** File size in bytes */
  size?: string;
  /** Last modified time */
  modifiedTime?: string;
  /** Web view link */
  webViewLink?: string;
  /** Web content link (download) */
  webContentLink?: string;
  /** Parent folder IDs */
  parents?: string[];
  /** Shortcut details (if file is a shortcut) */
  shortcutDetails?: {
    targetId: string;
    targetMimeType: string;
  };
  /** File owners */
  owners?: DriveFileOwner[];
}

/**
 * Google Drive file owner
 */
export interface DriveFileOwner {
  /** Owner email address */
  emailAddress: string;
  /** Owner display name */
  displayName: string;
}

/**
 * Uploaded file result
 */
export interface DriveUploadedFile {
  /** File ID */
  id: string;
  /** File name */
  name: string;
  /** Direct URL for images (usable in Next.js Image) */
  url: string;
  /** Original web view link */
  originalUrl: string;
  /** Download URL */
  downloadUrl?: string;
  /** MIME type */
  mimeType?: string;
}

// ============================================================================
// Pagination
// ============================================================================

/**
 * Pagination metadata for list operations
 */
export interface DrivePagination {
  /** Current page token */
  pageToken: string | null;
  /** Next page token */
  nextPageToken: string | null;
  /** Total items */
  totalItems: number;
  /** Items per page */
  pageSize: number;
}

// ============================================================================
// Validation Types
// ============================================================================

/**
 * Validation result for drive inputs
 */
export interface DriveValidationResult {
  /** Whether the input is valid */
  isValid: boolean;
  /** Error messages */
  errors: string[];
}

/**
 * Validation options for different operations
 */
export interface DriveValidationOptions {
  /** Maximum file size in bytes (default: 5MB) */
  maxFileSize?: number;
  /** Allowed MIME types for uploads */
  allowedMimeTypes?: string[];
  /** Required fields for specific actions */
  requiredFields?: string[];
}
