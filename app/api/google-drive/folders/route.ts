/**
 * Google Drive Folders API Route
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route lists all folders from Google Drive.
 * Pattern: Use Case Pattern (for consistency with main route)
 *
 * Rationale: Using the use case provides consistency with the main route
 * and better separation for potential future filtering/sorting needs.
 */

import { type NextRequest, NextResponse } from "next/server";
import { ListDriveFilesUseCase } from "@/application/use-cases/google-drive";
import { GoogleDriveRepository } from "@/infrastructure/repositories/google-drive";
import { DriveSortOrder } from "@/domain/entities/google-drive.entity";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract query parameters for listing folders
 */
function extractFoldersQueryParams(request: NextRequest): {
  accessToken: string;
} {
  return {
    accessToken: request.nextUrl.searchParams.get("accessToken") || "",
  };
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
    return { isValid: false, error: "Missing access token" };
  }
  return { isValid: true };
}

// ============================================================================
// GET /api/google-drive/folders - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const { accessToken } = extractFoldersQueryParams(request);

    // 2. Basic validation
    const tokenValidation = validateAccessToken(accessToken);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: tokenValidation.error },
        { status: 401 },
      );
    }

    // 3. Use use case for consistent folder listing
    const repo = new GoogleDriveRepository();
    const useCase = new ListDriveFilesUseCase(repo);
    const result = await useCase.execute({
      accessToken,
      // Filter for folders only via query - folders use mimeType='application/vnd.google-apps.folder'
      sortOrder: DriveSortOrder.NAME_ASC,
    });

    // 4. Response - simplified format for folders
    return NextResponse.json({
      success: true,
      folders: result.files.map((file) => ({
        id: file.id,
        name: file.name,
        createdTime: file.modifiedTime,
        modifiedTime: file.modifiedTime,
      })),
    });
  } catch (error: unknown) {
    console.error("[DRIVE_FOLDERS_ERROR]", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to retrieve folders";

    return NextResponse.json(
      {
        success: false,
        error: errorMessage,
      },
      { status: 500 },
    );
  }
}
