/**
 * Management ID API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 *
 * This route demonstrates the hybrid pattern:
 * - GET: Uses use case for single read operation with validation
 * - PUT: Uses use case for complex write operation with validation
 * - DELETE: Uses use case for complex write operation with validation
 *
 * Pattern Choice Rationale:
 * - GET management by ID: Use case provides validation and consistent error handling
 * - PUT update: Use case provides validation, logging, and duplicate checking
 * - DELETE: Use case provides validation, activity logging, and Google Drive photo deletion
 */

import { type NextRequest, NextResponse } from "next/server";
import type { ManagementServerData } from "@/domain/entities/management.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import { ManagementRepositoryPrisma } from "@/infrastructure/repositories/management";
import {
  GetManagementByIdUseCase,
  UpdateManagementUseCase,
  DeleteManagementUseCase,
} from "@/application/use-cases/management";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractIdParam(
  params: Promise<{ id: string }>,
): Promise<string> {
  const { id } = await params;
  return id;
}

async function extractUpdateManagementBody(
  request: NextRequest,
): Promise<ManagementServerData> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateId(id: string): { isValid: boolean; error?: string } {
  if (!id || id.trim() === "") {
    return { isValid: false, error: "Management ID is required" };
  }

  // UUID validation (basic format check)
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  if (!uuidRegex.test(id)) {
    return { isValid: false, error: "Invalid management ID format" };
  }

  return { isValid: true };
}

function validateUpdateManagementInput(body: ManagementServerData): {
  isValid: boolean;
  error?: string;
} {
  const errors: string[] = [];

  if (!body.userId || body.userId.trim() === "") {
    errors.push("User ID is required");
  }

  if (!body.periodId || body.periodId.trim() === "") {
    errors.push("Period ID is required");
  }

  if (!body.position) {
    errors.push("Position is required");
  }

  if (!body.department) {
    errors.push("Department is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Extract file ID from photo URL or direct ID
 */
function extractFileIdFromPhoto(photo: string): string | null {
  // Handle direct file IDs (33 characters, alphanumeric with underscores/hyphens)
  if (photo.length === 33 && /^[a-zA-Z0-9_-]+$/.test(photo)) {
    return photo;
  }

  // Handle Google Drive URLs
  const patterns = [
    /[?&]id=([a-zA-Z0-9_-]+)/,
    /\/file\/d\/([a-zA-Z0-9_-]+)/,
    /\/d\/([a-zA-Z0-9_-]+)/,
    /uc\?export=view&id=([a-zA-Z0-9_-]+)/,
  ];

  for (const pattern of patterns) {
    const match = photo.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return null;
}

/**
 * Delete photo from Google Drive
 */
async function deletePhotoFromDrive(
  request: NextRequest,
  photo: string,
): Promise<void> {
  const fileId = extractFileIdFromPhoto(photo);
  if (!fileId) return;

  try {
    const accessToken = request.headers
      .get("authorization")
      ?.replace("Bearer ", "");

    if (accessToken) {
      const { callApi } = await import("@/presentation/services/google-drive");
      await callApi({
        action: "delete",
        fileId,
        accessToken,
      });
      console.log(
        `Successfully deleted photo file ${fileId} from Google Drive`,
      );
    } else {
      console.warn("No access token available for photo deletion");
    }
  } catch (deleteError) {
    console.warn("Failed to delete photo from Drive:", deleteError);
    // Continue with management deletion even if photo deletion fails
  }
}

// ============================================================================
// GET /api/management/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateId(id);
    if (!validation.isValid) {
      return NextResponse.json(
        {
          success: false,
          error: validation.error,
        },
        { status: 400 },
      );
    }

    // 3. Use use case for read operation with validation
    const repo = new ManagementRepositoryPrisma();
    const useCase = new GetManagementByIdUseCase(repo);
    const management = await useCase.execute(id);

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: management,
    });
  } catch (error) {
    console.error("Error fetching management:", error);

    // Handle not found error
    if ((error as Error).message === "Management not found") {
      return NextResponse.json(
        {
          success: false,
          error: "Management not found",
        },
        { status: 404 },
      );
    }

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    // Handle invalid ID format
    if ((error as Error).message.includes("Invalid management ID format")) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch management",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/management/[id] - Use Case Pattern
// ============================================================================

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const id = await extractIdParam(params);
    const body = await extractUpdateManagementBody(request);

    // 2. Basic validation
    const idValidation = validateId(id);
    if (!idValidation.isValid) {
      return NextResponse.json(
        { success: false, error: idValidation.error },
        { status: 400 },
      );
    }

    const inputValidation = validateUpdateManagementInput(body);
    if (!inputValidation.isValid) {
      return NextResponse.json(
        { success: false, error: inputValidation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new ManagementRepositoryPrisma();
    const useCase = new UpdateManagementUseCase(repo);
    const management = await useCase.execute(id, body, { id: user.id });

    // 4. Response - consistent format
    return NextResponse.json({
      success: true,
      data: management,
      message: "Management updated successfully",
    });
  } catch (error) {
    console.error("Error updating management:", error);

    // Handle not found error
    if ((error as Error).message === "Management not found") {
      return NextResponse.json(
        { success: false, error: "Management not found" },
        { status: 404 },
      );
    }

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    // Handle invalid ID format
    if ((error as Error).message.includes("Invalid management ID format")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    // Handle duplicate/constraint errors
    if (
      (error as Error).message.includes("already has a management position") ||
      (error as Error).message.includes("already taken for this period")
    ) {
      return NextResponse.json(
        {
          success: false,
          error: (error as Error).message,
        },
        { status: 409 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to update management",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/management/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const id = await extractIdParam(params);

    // 2. Basic validation
    const validation = validateId(id);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Get management to check for photo before deletion
    const repo = new ManagementRepositoryPrisma();
    const getUseCase = new GetManagementByIdUseCase(repo);
    let management;
    try {
      management = await getUseCase.execute(id);
    } catch (e) {
      if ((e as Error).message === "Management not found") {
        return NextResponse.json(
          { success: false, error: "Management not found" },
          { status: 404 },
        );
      }
      throw e;
    }

    // 4. Delete photo from Google Drive if it exists
    if (management.photo) {
      await deletePhotoFromDrive(request, management.photo);
    }

    // 5. Use use case for complex write with validation and logging
    const deleteUseCase = new DeleteManagementUseCase(repo);
    await deleteUseCase.execute(id, { id: user.id });

    // 6. Response - consistent format
    return NextResponse.json({
      success: true,
      message: "Management deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting management:", error);

    // Handle not found error
    if ((error as Error).message === "Management not found") {
      return NextResponse.json(
        { success: false, error: "Management not found" },
        { status: 404 },
      );
    }

    // Handle validation errors
    if ((error as Error).message.includes("Validation failed")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    // Handle invalid ID format
    if ((error as Error).message.includes("Invalid management ID format")) {
      return NextResponse.json(
        { success: false, error: (error as Error).message },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to delete management",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}
