/**
 * Drive Image API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for complex read operations with validation
 *
 * Pattern Choice Rationale:
 * - GET: Use case provides better separation for validation, error handling,
 *        and fallback logic (placeholder images)
 */

import { type NextRequest, NextResponse } from "next/server";
import type { DriveImageInput } from "@/domain/entities/drive-image.entity";
import { GetDriveImageUseCase } from "@/application/use-cases/drive-image";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

/**
 * Extract drive image parameters from query string
 * @param request - The incoming request
 * @returns Drive image input parameters
 */
function extractDriveImageParams(request: NextRequest): DriveImageInput {
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
 * Validate drive image input parameters
 * @param input - The input parameters to validate
 * @returns Validation result with isValid flag and error message
 */
function validateDriveImageInput(input: DriveImageInput): {
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
// GET /api/drive-image - Use Case Pattern
// ============================================================================

export async function GET(request: NextRequest) {
  try {
    // 1. Extract payload
    const params = extractDriveImageParams(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateDriveImageInput(params);
    if (!validation.isValid) {
      return new NextResponse(validation.error, {
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // 3. Use use case for complex read with validation, error handling, and fallback
    const useCase = new GetDriveImageUseCase({
      cacheControl: "public, max-age=86400",
      enablePlaceholder: true,
    });
    const result = await useCase.execute(params);

    // 4. Response - binary data with appropriate headers
    return new NextResponse(result.data as unknown as BodyInit, {
      status: 200,
      headers: {
        "Content-Type": result.contentType,
        "Cache-Control": useCase.getCacheControl(),
        "X-Placeholder": result.isPlaceholder ? "true" : "false",
      },
    });
  } catch (error) {
    console.error("Error fetching drive image:", error);

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
      return new NextResponse((error as Error).message, {
        status: 400,
        headers: {
          "Content-Type": "text/plain",
        },
      });
    }

    // Return a simple error response for other errors
    return new NextResponse("Failed to fetch image", {
      status: 500,
      headers: {
        "Content-Type": "text/plain",
      },
    });
  }
}
