/**
 * Google Drive File Details API Route
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route gets details of a specific file from Google Drive.
 * Pattern: Direct Response Pattern (simple proxy operation)
 *
 * Rationale: This is a simple proxy operation that just forwards requests
 * to Google Drive API. The use case already exists in the main route.
 */

import { type NextRequest, NextResponse } from "next/server";
import { GetDriveFileUseCase } from "@/application/use-cases/google-drive";
import { GoogleDriveRepository } from "@/infrastructure/repositories/google-drive";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract path and header parameters for getting file details
 */
async function extractFileDetailsParams(
  request: NextRequest,
  params: { id: string },
): Promise<{
  accessToken: string;
  fileId: string;
}> {
  const authHeader = request.headers.get("Authorization");
  return {
    accessToken: authHeader?.replace("Bearer ", "") || "",
    fileId: params.id,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate authorization header is present
 */
function validateAuthorization(authHeader: string | null): {
  isValid: boolean;
  error?: string;
} {
  if (!authHeader) {
    return { isValid: false, error: "Authorization header missing" };
  }
  if (!authHeader.startsWith("Bearer ")) {
    return { isValid: false, error: "Invalid authorization format" };
  }
  return { isValid: true };
}

// ============================================================================
// GET /api/google-drive/files/[id] - Direct Response Pattern
// ============================================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const { accessToken, fileId } = await extractFileDetailsParams(
      request,
      await params,
    );

    // 2. Basic validation
    const authValidation = validateAuthorization(
      request.headers.get("Authorization"),
    );
    if (!authValidation.isValid) {
      return NextResponse.json(
        { error: authValidation.error },
        { status: 401 },
      );
    }

    if (!fileId) {
      return NextResponse.json(
        { error: "File ID is required" },
        { status: 400 },
      );
    }

    // 3. Use use case for consistent file details retrieval
    const repo = new GoogleDriveRepository();
    const useCase = new GetDriveFileUseCase(repo);
    const result = await useCase.execute({
      accessToken,
      fileId,
    });

    // 4. Response - return file data
    return NextResponse.json({
      id: result.file.id,
      name: result.file.name,
      owners: result.file.owners,
    });
  } catch (error) {
    console.error("Error fetching file details:", error);
    return NextResponse.json(
      { error: "Failed to fetch file details" },
      { status: 500 },
    );
  }
}
