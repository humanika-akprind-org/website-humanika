/**
 * Gallery API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateGalleryInput } from "@/domain/entities/gallery.entity";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetGalleryByIdUseCase,
  UpdateGalleryUseCase,
  DeleteGalleryUseCase,
} from "@/application/use-cases/gallery";
import { GalleryRepositoryPrisma } from "@/infrastructure/repositories/gallery";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateGalleryBody(
  request: NextRequest,
): Promise<UpdateGalleryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateGalleryInput(body: UpdateGalleryInput) {
  const errors: string[] = [];

  if (body.title !== undefined && body.title.trim() === "") {
    errors.push("Title cannot be empty");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/galleries/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
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
    const id = (await params).id;

    // 2. Use use case for single entity retrieval
    const repo = new GalleryRepositoryPrisma();
    const useCase = new GetGalleryByIdUseCase(repo);
    const gallery = await useCase.execute(id);

    // 3. Response
    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Error fetching gallery:", error);

    if ((error as Error).message === "Gallery not found") {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/galleries/[id] - Use Case Pattern
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
    const id = (await params).id;
    const body = await extractUpdateGalleryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateGalleryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new GalleryRepositoryPrisma();
    const useCase = new UpdateGalleryUseCase(repo);
    const gallery = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: gallery,
    });
  } catch (error) {
    console.error("Error updating gallery:", error);

    if ((error as Error).message === "Gallery not found") {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 },
      );
    }

    // Handle validation errors specifically
    if ((error as Error).message.includes("Validation failed")) {
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
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/galleries/[id] - Use Case Pattern
// ============================================================================

export async function DELETE(
  _request: NextRequest,
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
    const id = (await params).id;

    // 2. Use use case for complex write with existence checking and logging
    const repo = new GalleryRepositoryPrisma();
    const useCase = new DeleteGalleryUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      message: "Gallery deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery:", error);

    if ((error as Error).message === "Gallery not found") {
      return NextResponse.json(
        { success: false, error: "Gallery not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}
