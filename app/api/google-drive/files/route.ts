/**
 * Google Drive Files API Route
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route lists all files from Google Drive.
 * Pattern: Use Case Pattern (for consistency with main route)
 *
 * Rationale: Using the use case provides consistency with the main route
 * and better separation for potential future filtering/pagination needs.
 */

import { type NextRequest, NextResponse } from "next/server";
import { ListDriveFilesUseCase } from "@/application/use-cases/google-drive";
import { GoogleDriveRepository } from "@/infrastructure/repositories/google-drive";
import { DriveSortOrder } from "@/domain/entities/google-drive.entity";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract query parameters for listing files
 */
function extractFilesQueryParams(request: NextRequest): {
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
    return { isValid: false, error: "Access token is required" };
  }
  return { isValid: true };
}

// ============================================================================
// GET /api/google-drive/files - Use Case Pattern
// ============================================================================

export async function GET(req: NextRequest) {
  try {
    // 1. Extract payload
    const { accessToken } = extractFilesQueryParams(req);

    // 2. Basic validation
    const tokenValidation = validateAccessToken(accessToken);
    if (!tokenValidation.isValid) {
      return NextResponse.json(
        { success: false, error: tokenValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for consistent file listing
    const repo = new GoogleDriveRepository();
    const useCase = new ListDriveFilesUseCase(repo);
    const result = await useCase.execute({
      accessToken,
      sortOrder: DriveSortOrder.MODIFIED_TIME_DESC,
    });

    // 4. Response - simplified format for backward compatibility
    return NextResponse.json({
      success: true,
      files: result.files.map((file) => ({
        id: file.id,
        name: file.name,
        size: file.size,
        mimeType: file.mimeType,
        createdTime: file.modifiedTime,
        webViewLink: file.webViewLink,
      })),
    });
  } catch (error: unknown) {
    console.error("Error fetching files:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Failed to fetch files";
    return NextResponse.json(
      { success: false, error: errorMessage },
      { status: 500 },
    );
  }
}
