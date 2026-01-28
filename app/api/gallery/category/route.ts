/**
 * Gallery Category API Route - Clean Architecture Hybrid Pattern
 * Part of Clean Architecture: Presentation Layer (API)
 */

import { type NextRequest, NextResponse } from "next/server";
import type { CreateGalleryCategoryInput } from "@/domain/value-objects/gallery-category";
import { getCurrentUser } from "@/presentation/lib/auth-server";
import {
  GetGalleryCategoriesUseCase,
  CreateGalleryCategoryUseCase,
} from "@/application/use-cases/gallery-category";
import { GalleryCategoryRepositoryPrisma } from "@/infrastructure/repositories/gallery-category";

// ============================================================================
// Payload Extraction Functions
// ============================================================================

async function extractCreateGalleryCategoryBody(
  request: NextRequest,
): Promise<CreateGalleryCategoryInput> {
  return await request.json();
}

// ============================================================================
// Validation Functions
// ============================================================================

function validateCreateGalleryCategoryInput(body: CreateGalleryCategoryInput) {
  const errors: string[] = [];

  if (!body.name || body.name.trim() === "") {
    errors.push("Name is required");
  }

  if (errors.length > 0) {
    return { isValid: false, error: errors.join(", ") };
  }

  return { isValid: true };
}

// ============================================================================
// GET /api/gallery/category - Use Case Pattern
// ============================================================================

export async function GET(_request: NextRequest) {
  try {
    // 1. Use use case for simple read operation
    const repo = new GalleryCategoryRepositoryPrisma();
    const useCase = new GetGalleryCategoriesUseCase(repo);
    const categories = await useCase.execute();

    // 2. Response
    return NextResponse.json({
      success: true,
      data: categories,
    });
  } catch (error) {
    console.error("Error fetching gallery categories:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch gallery categories",
        message: (error as Error).message,
      },
      { status: 500 },
    );
  }
}

// ============================================================================
// POST /api/gallery/category - Use Case Pattern
// ============================================================================

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized" },
        { status: 401 },
      );
    }

    // 1. Extract payload
    const body = await extractCreateGalleryCategoryBody(request);

    // 2. Basic validation (use case will do deeper validation)
    const validation = validateCreateGalleryCategoryInput(body);
    if (!validation.isValid) {
      return NextResponse.json(
        { success: false, error: validation.error },
        { status: 400 },
      );
    }

    // 3. Use use case for write with validation and logging
    const repo = new GalleryCategoryRepositoryPrisma();
    const useCase = new CreateGalleryCategoryUseCase(repo);
    const category = await useCase.execute(body, { id: user.id });

    // 4. Response
    return NextResponse.json(
      {
        success: true,
        data: category,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error creating gallery category:", error);

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
