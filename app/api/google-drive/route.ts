/**
 * Google Drive API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 * - POST: Uses use case for complex write operations with validation
 *
 * Pattern Choice Rationale:
 * - GET: Use case provides better separation for pagination and filtering
 * - POST: Use case provides validation, logging, and token refresh handling
 */

import { type NextRequest, NextResponse } from "next/server";
import {
  ListDriveFilesUseCase,
  UploadDriveFileUseCase,
  RenameDriveFileUseCase,
  DeleteDriveFileUseCase,
  GetDriveFileUseCase,
  GetDriveFileUrlUseCase,
  SetDriveFilePermissionUseCase,
  CreateDriveFolderUseCase,
} from "@/application/use-cases/google-drive";
import { GoogleDriveRepository } from "@/infrastructure/repositories/google-drive";
import type {
  ListDriveFilesInput,
  UploadDriveFileInput,
} from "@/domain/entities/google-drive.entity";

// ============================================================================
// Constants
// ============================================================================

/** Maximum file size limit (5MB) */
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract query parameters for listing files
 */
function extractListFilesParams(request: NextRequest): ListDriveFilesInput {
  const { searchParams } = new URL(request.url);
  return {
    accessToken: searchParams.get("accessToken") || "",
    folderId: searchParams.get("folderId") || undefined,
    pageToken: searchParams.get("pageToken") || undefined,
    pageSize: searchParams.get("pageSize")
      ? parseInt(searchParams.get("pageSize") || "20", 10)
      : undefined,
  };
}

/**
 * Extract multipart form data for file upload
 */
async function extractUploadFileBody(
  request: NextRequest,
): Promise<UploadDriveFileInput> {
  const formData = await request.formData();
  const file = formData.get("file") as File | null;

  if (!file) {
    throw new Error("File is required");
  }

  const accessToken = formData.get("accessToken") as string;
  const folderId = formData.get("folderId") as string;
  const fileName = formData.get("fileName") as string;

  return {
    accessToken,
    file: {
      name: file.name,
      type: file.type,
      size: file.size,
      buffer: Buffer.from(await file.arrayBuffer()),
    },
    folderId: folderId || undefined,
    fileName: fileName || undefined,
  };
}

/**
 * Extract JSON body for file operations
 */
async function extractFileOperationBody(request: NextRequest): Promise<{
  action: string;
  accessToken: string;
  fileId?: string;
  fileName?: string;
  permission?: {
    role: string;
    type: string;
    value?: string;
  };
  folderId?: string;
}> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate access token is present
 */
function validateAccessToken(accessToken: string): {
  isValid: boolean;
  error?: string;
} {
  if (!accessToken || accessToken.trim() === "") {
    return { isValid: false, error: "Access token is required" };
  }
  return { isValid: true };
}

/**
 * Validate file size does not exceed limit
 */
function validateFileSize(size: number): { isValid: boolean; error?: string } {
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
 * Validate required fields for file operations
 */
function validateFileOperationInput(input: {
  action: string;
  accessToken: string;
  fileId?: string;
  fileName?: string;
}): { isValid: boolean; error?: string } {
  // Validate access token
  const tokenValidation = validateAccessToken(input.accessToken);
  if (!tokenValidation.isValid) {
    return tokenValidation;
  }

  // Validate file ID for operations that require it
  const actionsRequiringFileId = [
    "rename",
    "delete",
    "trash",
    "get",
    "getUrl",
    "setPublicAccess",
  ];

  if (
    actionsRequiringFileId.includes(input.action) &&
    (!input.fileId || input.fileId.trim() === "")
  ) {
    return {
      isValid: false,
      error: `File ID is required for action: ${input.action}`,
    };
  }

  // Validate file name for operations that require it
  const actionsRequiringFileName = ["rename", "createFolder"];

  if (
    actionsRequiringFileName.includes(input.action) &&
    (!input.fileName || input.fileName.trim() === "")
  ) {
    return {
      isValid: false,
      error: `File name is required for action: ${input.action}`,
    };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/google-drive - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const input = extractListFilesParams(request);

    // 2. Basic validation
    const tokenValidation = validateAccessToken(input.accessToken);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: tokenValidation.error },
        { status: 401 },
      );
    }

    // 3. Use use case for complex read with validation and pagination
    const repo = new GoogleDriveRepository();
    const useCase = new ListDriveFilesUseCase(repo);
    const result = await useCase.execute(input);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      files: result.files,
      folderId: result.folderId,
      nextPageToken: result.nextPageToken,
    });
  } catch (error) {
    console.error("Error listing drive files:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to list files",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/google-drive - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    // Handle file uploads (multipart/form-data)
    if (contentType.includes("multipart/form-data")) {
      return await handleFileUpload(request);
    }

    // Handle other actions (JSON)
    return await handleFileOperation(request);
  } catch (error) {
    console.error("[DRIVE_API_ERROR]", error);

    let message = "Operation failed";
    let statusCode = 500;

    if (error instanceof Error) {
      message = error.message;
    }

    if (typeof error === "object" && error !== null && "statusCode" in error) {
      statusCode = (error as { statusCode?: number }).statusCode || 500;
    }

    if (typeof error === "object" && error !== null && "response" in error) {
      const err = error as { response?: { status?: number } };
      statusCode = err.response?.status || 500;
    }

    return NextResponse.json(
      {
        success: false,
        message,
      },
      { status: statusCode },
    );
  }
}

// ============================================================================
// File Upload Handler
// ============================================================================

async function handleFileUpload(request: NextRequest) {
  try {
    // 1. Extract payload
    const input = await extractUploadFileBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const tokenValidation = validateAccessToken(input.accessToken);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: tokenValidation.error },
        { status: 401 },
      );
    }

    const sizeValidation = validateFileSize(input.file.size);
    if (!sizeValidation.isValid) {
      return NextResponse.json(
        { success: false, error: sizeValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and token refresh
    const repo = new GoogleDriveRepository();
    const useCase = new UploadDriveFileUseCase(repo);
    const result = await useCase.execute(input);

    // 4. Response
    return NextResponse.json({
      success: true,
      file: result.file,
    });
  } catch (error) {
    console.error("Error uploading file:", error);

    // Handle authentication errors
    if (
      (error as Error).message.includes("Authentication expired") ||
      (error as Error).message.includes("re-authenticate")
    ) {
      return NextResponse.json(
        {
          success: false,
          message: (error as Error).message,
        },
        { status: 401 },
      );
    }

    throw error;
  }
}

// ============================================================================
// File Operation Handler
// ============================================================================

async function handleFileOperation(request: NextRequest) {
  // 1. Extract payload
  const body = await extractFileOperationBody(request);

  // 2. Basic validation
  const validation = validateFileOperationInput(body);
  if (!validation.isValid) {
    return NextResponse.json(
      { success: false, error: validation.error },
      { status: 400 },
    );
  }

  const { action, accessToken, fileId, fileName, permission, folderId } = body;

  // 3. Use use case for complex write operations
  const repo = new GoogleDriveRepository();

  switch (action) {
    case "rename": {
      const useCase = new RenameDriveFileUseCase(repo);
      await useCase.execute({
        accessToken,
        fileId: fileId!,
        newName: fileName!,
      });
      return NextResponse.json({ success: true });
    }

    case "delete": {
      const useCase = new DeleteDriveFileUseCase(repo);
      await useCase.execute({
        accessToken,
        fileId: fileId!,
        permanent: true,
      });
      return NextResponse.json({ success: true });
    }

    case "trash": {
      const useCase = new DeleteDriveFileUseCase(repo);
      await useCase.execute({
        accessToken,
        fileId: fileId!,
        permanent: false,
      });
      return NextResponse.json({ success: true });
    }

    case "get": {
      const useCase = new GetDriveFileUseCase(repo);
      const result = await useCase.execute({
        accessToken,
        fileId: fileId!,
      });

      // Handle file not found
      if (!result.success) {
        return NextResponse.json(
          {
            success: false,
            message: "File not found in Google Drive",
            notFound: true,
            fileId,
          },
          { status: 404 },
        );
      }

      return NextResponse.json({
        success: true,
        file: {
          id: result.file.id,
          name: result.file.name,
          owners: result.file.owners,
        },
      });
    }

    case "getUrl": {
      const useCase = new GetDriveFileUrlUseCase(repo);
      const result = await useCase.execute({
        accessToken,
        fileId: fileId!,
      });

      return NextResponse.json({
        success: true,
        url: result.url,
        originalUrl: result.originalUrl,
      });
    }

    case "setPublicAccess": {
      if (!fileId || !permission) {
        throw new Error("Missing file ID or permission");
      }
      const useCase = new SetDriveFilePermissionUseCase(repo);
      await useCase.execute({
        accessToken,
        fileId,
        permission,
      });
      return NextResponse.json({ success: true });
    }

    case "createFolder": {
      const useCase = new CreateDriveFolderUseCase(repo);
      const result = await useCase.execute({
        accessToken,
        name: fileName!,
        parentId: folderId,
      });

      return NextResponse.json({
        success: true,
        folder: result.folder,
      });
    }

    default:
      return NextResponse.json(
        { success: false, error: `Invalid action: ${action}` },
        { status: 400 },
      );
  }
}
