/**
 * Google Drive Use Cases - Application Layer
 * Part of Clean Architecture: Application Layer (Use Cases)
 *
 * This module provides use cases for Google Drive file operations:
 * - List files with pagination
 * - Upload files
 * - Manage files (rename, delete, trash, get details, get URL)
 * - Set permissions
 * - Create folders
 */

import type {
  ListDriveFilesInput,
  ListDriveFilesResult,
  UploadDriveFileInput,
  UploadDriveFileResult,
  RenameDriveFileInput,
  DeleteDriveFileInput,
  GetDriveFileInput,
  GetDriveFileUrlInput,
  SetDriveFilePermissionInput,
  CreateDriveFolderInput,
  DriveFileOperationResult,
} from "@/domain/entities/google-drive.entity";
import { GoogleDriveRepository } from "@/infrastructure/repositories/google-drive";

// ============================================================================
// Options
// ============================================================================

/**
 * Options for list files use case
 */
export interface ListDriveFilesOptions {
  /** Maximum file size for uploads (default: 5MB) */
  maxFileSize?: number;
}

/**
 * Options for upload file use case
 */
export interface UploadDriveFileOptions {
  /** Maximum file size in bytes (default: 5MB) */
  maxFileSize?: number;
}

// ============================================================================
// List Drive Files Use Case
// ============================================================================

/**
 * List Drive Files Use Case
 *
 * Encapsulates the business logic for listing files in a Google Drive folder.
 */
export class ListDriveFilesUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new ListDriveFilesUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to list drive files
   * @param input - Input parameters for listing files
   * @returns Promise resolving to list result
   */
  async execute(input: ListDriveFilesInput): Promise<ListDriveFilesResult> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Execute repository operation
    const result = await this.repository.listFiles(input);

    return result;
  }
}

// ============================================================================
// Upload Drive File Use Case
// ============================================================================

/**
 * Upload Drive File Use Case
 *
 * Encapsulates the business logic for uploading files to Google Drive.
 */
export class UploadDriveFileUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new UploadDriveFileUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to upload a file
   * @param input - Input parameters for file upload
   * @returns Promise resolving to upload result
   */
  async execute(input: UploadDriveFileInput): Promise<UploadDriveFileResult> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file size
    const sizeValidation = this.repository.validateFileSize(input.file.size);
    if (!sizeValidation.isValid) {
      throw new Error(sizeValidation.error);
    }

    // 3. Execute repository operation
    const result = await this.repository.uploadFile(input);

    return result;
  }
}

// ============================================================================
// Rename Drive File Use Case
// ============================================================================

/**
 * Rename Drive File Use Case
 *
 * Encapsulates the business logic for renaming files in Google Drive.
 */
export class RenameDriveFileUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new RenameDriveFileUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to rename a file
   * @param input - Input parameters for renaming
   * @returns Promise resolving to operation result
   */
  async execute(
    input: RenameDriveFileInput,
  ): Promise<DriveFileOperationResult> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file ID
    const fileIdValidation = this.repository.validateFileId(input.fileId);
    if (!fileIdValidation.isValid) {
      throw new Error(fileIdValidation.error);
    }

    // 3. Validate new name
    if (!input.newName || input.newName.trim() === "") {
      throw new Error("New file name is required");
    }

    // 4. Execute repository operation
    const result = await this.repository.renameFile(input);

    return result;
  }
}

// ============================================================================
// Delete Drive File Use Case
// ============================================================================

/**
 * Delete Drive File Use Case
 *
 * Encapsulates the business logic for deleting/trashing files in Google Drive.
 */
export class DeleteDriveFileUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new DeleteDriveFileUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to delete a file
   * @param input - Input parameters for deletion
   * @returns Promise resolving to operation result
   */
  async execute(
    input: DeleteDriveFileInput,
  ): Promise<DriveFileOperationResult> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file ID
    const fileIdValidation = this.repository.validateFileId(input.fileId);
    if (!fileIdValidation.isValid) {
      throw new Error(fileIdValidation.error);
    }

    // 3. Execute repository operation
    const result = await this.repository.deleteFile(input);

    return result;
  }
}

// ============================================================================
// Get Drive File Use Case
// ============================================================================

/**
 * Get Drive File Use Case
 *
 * Encapsulates the business logic for getting file details from Google Drive.
 */
export class GetDriveFileUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new GetDriveFileUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to get file details
   * @param input - Input parameters for getting file
   * @returns Promise resolving to file details
   */
  async execute(input: GetDriveFileInput): Promise<{
    file: {
      id: string;
      name: string;
      owners: { emailAddress: string; displayName: string }[];
    };
    success: boolean;
  }> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file ID
    const fileIdValidation = this.repository.validateFileId(input.fileId);
    if (!fileIdValidation.isValid) {
      throw new Error(fileIdValidation.error);
    }

    // 3. Execute repository operation
    const result = await this.repository.getFile(input);

    return {
      file: {
        id: result.file.id,
        name: result.file.name,
        owners: result.file.owners || [],
      },
      success: result.success,
    };
  }
}

// ============================================================================
// Get Drive File URL Use Case
// ============================================================================

/**
 * Get Drive File URL Use Case
 *
 * Encapsulates the business logic for getting shareable file URL from Google Drive.
 */
export class GetDriveFileUrlUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new GetDriveFileUrlUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to get file URL
   * @param input - Input parameters for getting file URL
   * @returns Promise resolving to file URL result
   */
  async execute(input: GetDriveFileUrlInput): Promise<{
    url: string;
    originalUrl: string;
    success: boolean;
  }> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file ID
    const fileIdValidation = this.repository.validateFileId(input.fileId);
    if (!fileIdValidation.isValid) {
      throw new Error(fileIdValidation.error);
    }

    // 3. Execute repository operation
    const result = await this.repository.getFileUrl(input);

    return result;
  }
}

// ============================================================================
// Set Drive File Permission Use Case
// ============================================================================

/**
 * Set Drive File Permission Use Case
 *
 * Encapsulates the business logic for setting file permissions in Google Drive.
 */
export class SetDriveFilePermissionUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new SetDriveFilePermissionUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to set file permission
   * @param input - Input parameters for setting permission
   * @returns Promise resolving to operation result
   */
  async execute(
    input: SetDriveFilePermissionInput,
  ): Promise<DriveFileOperationResult> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate file ID
    const fileIdValidation = this.repository.validateFileId(input.fileId);
    if (!fileIdValidation.isValid) {
      throw new Error(fileIdValidation.error);
    }

    // 3. Validate permission
    if (!input.permission) {
      throw new Error("Permission object is required");
    }

    // 4. Execute repository operation
    const result = await this.repository.setFilePermission(input);

    return result;
  }
}

// ============================================================================
// Create Drive Folder Use Case
// ============================================================================

/**
 * Create Drive Folder Use Case
 *
 * Encapsulates the business logic for creating folders in Google Drive.
 */
export class CreateDriveFolderUseCase {
  private readonly repository: GoogleDriveRepository;

  /**
   * Create a new CreateDriveFolderUseCase instance
   * @param repository - Google Drive repository
   */
  constructor(repository?: GoogleDriveRepository) {
    this.repository = repository || new GoogleDriveRepository();
  }

  /**
   * Execute the use case to create a folder
   * @param input - Input parameters for creating folder
   * @returns Promise resolving to folder creation result
   */
  async execute(input: CreateDriveFolderInput): Promise<{
    folder: { id: string; name: string; mimeType: string };
    success: boolean;
  }> {
    // 1. Validate access token
    const tokenValidation = this.repository.validateAccessToken(
      input.accessToken,
    );
    if (!tokenValidation.isValid) {
      throw new Error(tokenValidation.error);
    }

    // 2. Validate folder name
    const nameValidation = this.repository.validateFolderName(input.name);
    if (!nameValidation.isValid) {
      throw new Error(nameValidation.error);
    }

    // 3. Execute repository operation
    const result = await this.repository.createFolder(input);

    return result;
  }
}
