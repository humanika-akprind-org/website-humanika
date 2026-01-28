/**
 * Gallery Category API Route [id] - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import type { UpdateGalleryCategoryInput } from "@/domain/value-objects/gallery-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetGalleryCategoryByIdUseCase,
  UpdateGalleryCategoryUseCase,
  DeleteGalleryCategoryUseCase,
} from "@/application/use-cases/gallery-category";
import { GalleryCategoryRepositoryPrisma } from "@/infrastructure/repositories/gallery-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractUpdateGalleryCategoryBody(
  request: NextRequest,
): Promise<UpdateGalleryCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateUpdateGalleryCategoryInput(body: UpdateGalleryCategoryInput) {
  const errors: string[] = [];

  if (body.name !== undefined && body.name.trim() === "") {
    errors.push("Name cannot be empty");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/gallery/category/[id] - Use Case Pattern
// ============================================================================

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    // 1. Extract payload
    const id = (await params).id;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    // 2. Use use case for single entity retrieval
    const repo = new GalleryCategoryRepositoryPrisma();
    const useCase = new GetGalleryCategoryByIdUseCase(repo);
    const category = await useCase.execute(id);

    if (!category) {
      return NextResponse.json(
        { success: false, error: "Gallery category not found" },
        { status: 404 },
      );
    }

    // 3. Response
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error fetching gallery category:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery category",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// PUT /api/gallery/category/[id] - Use Case Pattern
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    const body = await extractUpdateGalleryCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateUpdateGalleryCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for complex write with validation and logging
    const repo = new GalleryCategoryRepositoryPrisma();
    const useCase = new UpdateGalleryCategoryUseCase(repo);
    const category = await useCase.execute(id, body, { id: user.id });

    // 4. Response
    return NextResponse.json({
      success: true,
      data: category,
    });
  } catch (error) {
    console.error("Error updating gallery category:", error);

    if ((error as Error).message === "Gallery category not found") {
      return NextResponse.json(
        { success: false, error: "Gallery category not found" },
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

    // Handle duplicate errors
    if ((error as Error).message.includes("already exists")) {
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
        error: "Internal server error",
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// DELETE /api/gallery/category/[id] - Use Case Pattern
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

    if (!id) {
      return NextResponse.json(
        { success: false, error: "Category ID is required" },
        { status: 400 },
      );
    }

    // 2. Use use case for complex write with existence checking and logging
    const repo = new GalleryCategoryRepositoryPrisma();
    const useCase = new DeleteGalleryCategoryUseCase(repo);
    await useCase.execute(id, { id: user.id });

    // 3. Response
    return NextResponse.json({
      success: true,
      message: "Gallery category deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting gallery category:", error);

    if ((error as Error).message === "Gallery category not found") {
      return NextResponse.json(
        { success: false, error: "Gallery category not found" },
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
