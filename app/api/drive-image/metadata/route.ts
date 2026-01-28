/**
 * Drive Image Metadata API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 *
 * Pattern Choice Rationale:
 * - GET: Use case provides better separation for validation,
 *        multiple fallback strategies, and consistent response format
 */

import { type NextRequest, NextResponse } from "next/server";
import type { DriveImageMetadataInput } from "@/domain/entities/drive-image.entity";
import { GetDriveImageMetadataUseCase } from "@/application/use-cases/drive-image";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract drive image metadata parameters from query string
 * @param request - The incoming request
 * @returns Drive image metadata input parameters
 */
function extractMetadataParams(request: NextRequest): DriveImageMetadataInput {
  const { searchParams } = new URL(request.url);
  return {
    fileId: searchParams.get("fileId") || "",
    accessToken: searchParams.get("accessToken") || undefined,
  };
}

// ============================================================================
// Validation Functions
// ============================================================================

/**
 * Validate drive image metadata input parameters
 * @param input - The input parameters to validate
 * @returns Validation result with isValid flag and error message
 */
function validateMetadataInput(input: DriveImageMetadataInput): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!input.fileId || input.fileId.trim() === "") {
    errors.push("File ID is required");
  }

  if (input.fileId && input.fileId.length < 5) {
    errors.push("Invalid file ID format");
  }

  // Validate file ID format (Google Drive IDs are typically 44+ chars)
  if (input.fileId && !/^[a-zA-Z0-9_-]+$/.test(input.fileId)) {
    errors.push("File ID contains invalid characters");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/drive-image/metadata - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const params = extractMetadataParams(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateMetadataInput(params);
    if (!validation.isValid) {
      return NextResponse.json({ error: validation.error }, { status: 400 });
    }

    // 3. Use use case for complex read with validation and fallback strategies
    const useCase = new GetDriveImageMetadataUseCase();
    const result = await useCase.execute(params);

    // 4. Response - consistent format
    return NextResponse.json({
      success: result.success,
      resolution: result.resolution,
      format: result.format,
      size: result.size,
    });
  } catch (error) {
    console.error("Error fetching drive image metadata:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 400 },
      );
    }

    // Return null values on error - frontend should handle this
    return NextResponse.json({
      success: false,
      resolution: null,
      format: null,
      size: null,
    });
  }
}
